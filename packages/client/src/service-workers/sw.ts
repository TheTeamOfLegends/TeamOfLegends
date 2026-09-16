// тип сущности, создаваемой плагином vite-plugin-pwa
type ManifestEntryType = {
  revision: string | null
  url: string
}

// у нас будет два кеша: для статики и динамических данных
// @ts-expect-error: константа внедряется сборщиком Vite во время build
const id = String(__BUILD_TIME__)
const CACHE_NAME = `star-shooter-${id}`
const CACHE_NAME_STATIC = `star-shooter-static-${id}`

// vite будет искать запись <self>.<__WB_MANIFEST>,
// чтобы подсунуть в него массив кешируемых адресов
// @ts-expect-error: __WB_MANIFEST внедряется плагином во время сборки
const manifest: ManifestEntryType[] = self.__WB_MANIFEST
const INDEX_ROUTE_KEY = manifest
  .filter(entry => entry.url.endsWith('index.html'))
  .pop()?.url

if (typeof INDEX_ROUTE_KEY !== 'string') {
  throw new Error('no path for index.html in __WB_MANIFEST')
}

// изначально self уже определен
// нужно строго, чтобы ts не ругался
const swSelf = self as unknown as ServiceWorkerGlobalScope

// инициализация кеша
swSelf.addEventListener('install', event => {
  // Новый воркер включится только тогда,
  // когда пользователь полностью закроет вообще все вкладки с игрой во всем браузере и откроет сайт заново.
  // Обычное обновление страницы через F5 не поможет.
  // Поэтому принудительно активируем новый воркер, не дожидаясь закрытия всех вкладок
  swSelf.skipWaiting()

  event.waitUntil(
    caches
      .open(CACHE_NAME_STATIC)
      .then(cache => {
        const filesToCache = manifest.map(entry => entry.url)
        return cache.addAll(filesToCache)
      })
      .catch(err => {
        throw err
      })
  )
})

// активация кеша
swSelf.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          // очищаем старый кеш
          cacheNames
            .filter(name => ![CACHE_NAME, CACHE_NAME_STATIC].includes(name))
            .map(name => caches.delete(name))
        )
      })
      .then(() => {
        // передаем этому воркеру контроль над всеми открытыми вкладками с игрой
        return swSelf.clients.claim()
      })
  )
})

// перехватываем все fetch запросы
// 1. навигация — network-first (SSR HTML со стилями Emotion); shell index.html только offline
// 2. статика (js/css/…) — cache-first
// 3. API/динамика — сеть, при ошибке кеш
swSelf.addEventListener('fetch', event => {
  const isRequestAboutStaticData =
    /\.(js|css|png|svg|woff|ico|webmanifest)[^.]*$/.test(event.request.url)
  const isNavigate = event.request.mode === 'navigate'
  const isOffLine = swSelf.navigator.onLine === false

  // HTML от Express SSR нельзя отдавать из кеша online:
  // в precache лежит сырой dist/client/index.html без <!--ssr-styles-->.
  if (isNavigate) {
    event.respondWith(
      (async () => {
        if (!isOffLine) {
          try {
            const response = await fetch(event.request)
            if (!badResponse(response)) {
              return response
            }
          } catch {
            // сеть недоступна — ниже offline-fallback
          }
        }

        const cacheResponse = await caches.match(INDEX_ROUTE_KEY)
        return cacheResponse || serviceUnavailable()
      })()
    )

    return
  }

  // Статика с хешами в имени — cache-first
  if (isRequestAboutStaticData) {
    event.respondWith(
      (async () => {
        const cacheResponse = await caches.match(event.request)
        if (cacheResponse) {
          return cacheResponse
        }

        if (isOffLine) {
          return serviceUnavailable()
        }

        const response = await fetch(event.request)

        if (badResponse(response)) {
          return response
        }

        const cache = await caches.open(CACHE_NAME_STATIC)
        await cache.put(event.request, response.clone())

        return response
      })()
    )

    return
  }

  // Блок обработки запросов с динамическими данными
  event.respondWith(
    (async () => {
      // в кеш попадает только get запрос
      if (event.request.method !== 'GET') {
        return fetch(event.request)
      }

      // Авторизация: network-first. В офлайне отдаём последний успешный ответ из кеша,
      // чтобы AuthGuard не считал пользователя разлогиненным при падении сети.
      if (event.request.url.includes('/v2/auth/user')) {
        if (isOffLine) {
          const cacheResponse = await caches.match(event.request)
          return cacheResponse || serviceUnavailable()
        }

        try {
          const response = await fetch(event.request)

          if (response.ok) {
            const cache = await caches.open(CACHE_NAME)
            await cache.put(event.request, response.clone())
          }

          return response
        } catch {
          const cacheResponse = await caches.match(event.request)
          return cacheResponse || serviceUnavailable()
        }
      }

      if (isOffLine) {
        const cacheResponse = await caches.match(event.request)
        return cacheResponse || serviceUnavailable()
      }

      // асинхронный фоновый запрос на запрос к серверу и обновление кеша
      const response = await fetch(event.request)
        .then(response => {
          // Если сервер ответил ошибкой, не кэшируем её, а просто отдаем
          if (badResponse(response)) {
            return response
          }
          // обновляем кеш
          return caches
            .open(CACHE_NAME)
            .then(cache => cache.put(event.request, response.clone()))
            .then(() => response)
        })
        .catch(async () => {
          const cacheResponse = await caches.match(event.request)
          return cacheResponse || serviceUnavailable()
        })

      return response
    })()
  )
})

/**
 * Слушаем события из приложения
 */
swSelf.addEventListener('message', event => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches
      .delete(CACHE_NAME)
      .catch(error =>
        console.error(`Ошибка очистки кеша ${CACHE_NAME}:`, error)
      )
  }
})

/**
 * не удается отправить запрос / нет инета
 * @returns
 */
function serviceUnavailable() {
  return new Response(JSON.stringify({ message: 'Network unavailable' }), {
    status: 503,
    statusText: 'Service Unavailable',
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Проверяет статус ответа
 * @param response
 * @returns
 */
function badResponse(response: Response) {
  return !response || response.status !== 200
}
