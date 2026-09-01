import escapeHTML from 'escape-html'

/**
 * Подготовка и проверка строкового значения переменной
 * @param data
 * @returns
 */
export function sanitizeString(data: unknown) {
  if (typeof data === 'string') {
    return escapeHTML(data.trim())
  }

  return null
}

/**
 * Подготовка и проверка числового значения переменной.
 * Ожидаем положительное целое число
 * @param data
 * @returns
 */
export function sanitizeNumber(data: unknown) {
  if (typeof data === 'string' || typeof data === 'number') {
    const value = Number(data)

    if (Number.isInteger(value) && value > 0) {
      return value
    }
  }

  return null
}

/**
 * Проверка булева значения переменной
 * @param data
 * @returns Вернет true для значений: true, 1, '1', 'True'
 */
export function sanitizeBoolean(data: unknown) {
  if (typeof data === 'string') {
    const value = data.trim().toLowerCase()
    return value === 'true' || value === '1'
  }

  return data === 1 || data === true
}
