import './client.d'

export const SERVER_HOST =
  typeof window === 'undefined'
    ? __INTERNAL_SERVER_URL__
    : __EXTERNAL_SERVER_URL__

export const API_BASE_URL = 'https://ya-praktikum.tech/api'

export const OAUTH_URL = 'https://oauth.yandex.ru/authorize'
