import { Router } from 'express'
import './theme.model'
import { getUserTheme, saveUserTheme } from './theme.controller'
import { Theme, ThemeUser, UserTheme } from './theme.model'
import { sequelize } from '../../../db'
import { optionalAuthMiddleware } from '../../middleware/optionalAuthMiddleware'

export const useThemeRoutes = (router: Router) => {
  const themesRouter: Router = Router()

  themesRouter
    .get('/', optionalAuthMiddleware, getUserTheme)
    .put('/', optionalAuthMiddleware, saveUserTheme)

  router.use('/v1/theme', themesRouter)
}

export const initUserThemeModels = () => {
  const models = [ThemeUser, Theme, UserTheme]

  models.forEach(model => {
    model.initModel(sequelize)
  })

  Theme.hasMany(UserTheme, { foreignKey: 'themeId' })

  UserTheme.belongsTo(Theme, { foreignKey: 'themeId' })

  ThemeUser.hasOne(UserTheme, {
    foreignKey: 'ownerId',
    as: 'userTheme',
  })

  UserTheme.belongsTo(ThemeUser, {
    foreignKey: 'ownerId',
    as: 'owner',
  })
}
