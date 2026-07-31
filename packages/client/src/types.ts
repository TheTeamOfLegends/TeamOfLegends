/**
 * Аргументы инициализации страницы (SSR / client).
 * Ранее зависели от Redux dispatch/state — теперь сторы Zustand доступны через getState().
 */
export type PageInitContext = {
  clientToken?: string
}

export type PageInitArgs = {
  ctx: PageInitContext
  params: Record<string, string | undefined>
}
