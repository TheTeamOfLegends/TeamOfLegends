export const ERROR_MESSAGES = {
  REQUEST_FAILED: 'Запрос завершился ошибкой',
  PASSWORD_CHANGE_FAILED: 'Ошибка при изменении пароля',
  AVATAR_CHANGE_FAILED: 'Ошибка при изменении аватара',
}

export const SUCCESS_MESSAGES = {
  PASSWORD_CHANGE_SUCCESS: 'Пароль успешно обновлен',
  AVATAR_CHANGE_SUCCESS: 'Пароль успешно обновлен',
}

export const VALIDATION_MESSAGES = {
  MIN_LENGTH: (length: number) => `Минимум ${length} символов`,
  MAX_LENGTH: (length: number) => `Максимум ${length} символов`,
  REQUIRED_INPUT: 'Обязательно для заполнения',
}
