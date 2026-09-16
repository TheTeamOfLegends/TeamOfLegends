import { Dialect, Sequelize } from 'sequelize'
import dbConfig from './sequelize.config.js'

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development'
const activeConfig = dbConfig[env] ?? dbConfig.development

if (!activeConfig.database) {
  throw new Error(
    'Set POSTGRES_DB via environment (.env or Docker compose). See .env.sample'
  )
}

if (!activeConfig.username) {
  throw new Error(
    'Set POSTGRES_USER via environment (.env or Docker compose). See .env.sample'
  )
}

export const sequelize = new Sequelize(
  activeConfig.database,
  activeConfig.username,
  activeConfig.password,
  {
    host: activeConfig.host,
    port: activeConfig.port,
    dialect: activeConfig.dialect as Dialect,
    logging: false,
  }
)

export const createClientAndConnect = async () => {
  try {
    const [results] = await sequelize.query('SELECT NOW()')
    const row = (results as { now?: string }[])[0]
    console.log('  ➜ 🎸 Connected to the database at:', row?.now)
  } catch (e) {
    console.error(
      '  ➜ 🎸 Database is not available on %s:%s. Start Postgres, e.g. `docker compose up postgres -d`',
      activeConfig.host,
      activeConfig.port
    )
    console.error(e)
  }
}
