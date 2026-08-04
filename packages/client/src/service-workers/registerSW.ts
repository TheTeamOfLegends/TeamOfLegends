/**
 * Регистрирует service worker только в production-сборке.
 * Путь всегда абсолютный (`/sw.js`), иначе на маршрутах вроде `/game`
 * браузер запросит `/game/sw.js` → SPA отдаст HTML → MIME type error.
 */
function registerSW(): void {
  if (typeof window === 'undefined') {
    return
  }

  if (!('serviceWorker' in navigator)) {
    return
  }

  // В dev Vite не отдаёт собранный sw.js — регистрация бесполезна и шумит в консоли
  if (!import.meta.env.PROD) {
    return
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log(
          'ServiceWorker registration successful with scope: ',
          registration.scope
        )
      })
      .catch((error: unknown) => {
        console.log('ServiceWorker registration failed: ', error)
      })
  })
}

export default registerSW
