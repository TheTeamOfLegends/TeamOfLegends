import { Dialect, Sequelize } from 'sequelize'
import dbConfig from './sequelize.config.js'

const dbDevConfig = dbConfig.development

if (!dbDevConfig.database) {
  throw 'Set database name'
}

if (!dbDevConfig.username) {
  throw 'Set database user'
}

export const sequelize = new Sequelize(
  dbDevConfig.database,
  dbDevConfig.username,
  dbDevConfig.password,
  {
    host: dbDevConfig.host,
    port: dbDevConfig.port,
    dialect: dbDevConfig.dialect as Dialect,
    logging: false,
  }
)

export const createClientAndConnect = async () => {
  try {
    const [results] = await sequelize.query('SELECT NOW()')
    console.log(
      '  ➜ 🎸 Connected to the database at:',
      (results as [{ now: string }])[0].now!
    )
  } catch (e) {
    console.error(
      '  ➜ 🎸 Database is not available on localhost:%s. Start Postgres, e.g. `docker compose up postgres -d`',
      dbDevConfig.port
    )
    console.error(e)
  }
}
