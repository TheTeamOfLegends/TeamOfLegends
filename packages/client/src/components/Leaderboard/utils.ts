export const formatScore = (value: number) => value.toLocaleString('ru-RU')

export const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))
