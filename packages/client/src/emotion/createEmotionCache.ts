import createCache, { type EmotionCache } from '@emotion/cache'

const isBrowser = typeof document !== 'undefined'

export const createEmotionCache = (): EmotionCache =>
  createCache({
    key: 'css',
    prepend: true,
  })

/** Общий кеш для клиента (гидратация). На сервере создаём новый на каждый запрос. */
export const clientEmotionCache = isBrowser ? createEmotionCache() : null
