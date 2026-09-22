import createCache, { type EmotionCache } from '@emotion/cache'

const isBrowser = typeof document !== 'undefined'

export const createEmotionCache = (): EmotionCache => {
  const cache = createCache({
    key: 'css',
    prepend: true,
  })
  // Совместимость с SSR/extractCritical (рекомендация Emotion/Chakra)
  cache.compat = true
  return cache
}

/** Общий кеш для клиента (гидратация). На сервере создаём новый на каждый запрос. */
export const clientEmotionCache = isBrowser ? createEmotionCache() : null
