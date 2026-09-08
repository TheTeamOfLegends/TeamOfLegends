import { randomUUID } from 'crypto'
import * as repository from './theme.repository'
import { normalizeGuestId } from './theme.util'

interface SaveUserThemeInput {
  theme: string
  login?: string
  guestId?: string
}

export const saveUserTheme = async (
  data: SaveUserThemeInput
): Promise<SaveUserThemeInput> => {
  const { theme, login, guestId } = data
  const randomGuestId = randomUUID()
  const resultGuestId = normalizeGuestId(guestId ? guestId : randomGuestId)
  const userId = login ?? resultGuestId
  const userTheme = await repository.saveUserTheme(userId, theme)
  const result: SaveUserThemeInput = { ...data, theme: userTheme.theme }

  if (!login && !guestId) {
    result.guestId = randomGuestId
  }

  return result
}

interface GetUserThemeInput {
  login?: string
  guestId?: string
}

interface GetUserThemeOutput extends GetUserThemeInput {
  theme: string
}

export const getUserTheme = async (
  data: GetUserThemeInput
): Promise<GetUserThemeOutput | null> => {
  const { login, guestId } = data
  const resultGuestId = guestId && normalizeGuestId(guestId)
  const userId = login ?? resultGuestId
  const userWithTheme = userId
    ? await repository.findUserByUserId(userId)
    : null

  if (!userWithTheme) {
    return null
  }

  const themeId = userWithTheme.userTheme?.themeId
  const activeUserTheme = themeId && (await repository.findThemeById(themeId))
  const theme = activeUserTheme ? activeUserTheme?.theme : undefined

  if (!theme) {
    return null
  }

  return { ...data, theme }
}
