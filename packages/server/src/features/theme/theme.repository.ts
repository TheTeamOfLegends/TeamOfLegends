import { Theme, ThemeUser, UserTheme } from './theme.model'
import { sequelize } from '../../../db'

const DEFAULT_DEVICE = 'default'

export const saveUserTheme = async (
  userId: string,
  theme: string
): Promise<Theme> => {
  return sequelize.transaction(async transaction => {
    const [siteTheme] = await Theme.findOrCreate({
      where: { theme },
      defaults: {
        theme,
      },
      transaction,
    })

    const [user] = await ThemeUser.findOrCreate({
      where: { userId },
      defaults: {
        userId,
      },
      transaction,
    })

    const userThemeRecord = await UserTheme.findOne({
      where: { ownerId: user.id },
      transaction,
    })

    if (userThemeRecord) {
      userThemeRecord.themeId = siteTheme.id
      await userThemeRecord.save({ transaction })
    } else {
      await UserTheme.create(
        {
          ownerId: user.id,
          themeId: siteTheme.id,
          device: DEFAULT_DEVICE,
        },
        { transaction }
      )
    }

    return siteTheme
  })
}

export const findUserByUserId = async (
  userId: string
): Promise<ThemeUser | null> => {
  return ThemeUser.findOne({
    where: { userId },
    attributes: ['id', 'userId'],
    include: [
      {
        model: UserTheme,
        as: 'userThemes',
        required: false,
        limit: 1,
      },
    ],
  })
}

export const findThemeById = async (id: number): Promise<Theme | null> => {
  return Theme.findByPk(id)
}
