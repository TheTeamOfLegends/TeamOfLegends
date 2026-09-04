const dotenv = require('dotenv')
const path = require('path')

// Локально подхватываем корневой .env; в Docker переменные приходят из compose/env_file
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_HOST,
  POSTGRES_PORT,
} = process.env

if (!POSTGRES_USER || !POSTGRES_DB) {
  // Не падаем на этапе require при сборке — проверка остаётся в db.ts при connect
  console.warn(
    '[sequelize.config] POSTGRES_USER / POSTGRES_DB не заданы. Задайте их через .env или environment Docker.'
  )
}

const PG_PORT = POSTGRES_PORT ?? 5432
const PG_HOST = POSTGRES_HOST || 'localhost'

module.exports = {
  development: {
    username: POSTGRES_USER,
    database: POSTGRES_DB,
    password: POSTGRES_PASSWORD,
    host: PG_HOST,
    port: Number(PG_PORT),
    dialect: 'postgres',
  },
  production: {
    username: POSTGRES_USER,
    database: POSTGRES_DB,
    password: POSTGRES_PASSWORD,
    host: PG_HOST,
    port: Number(PG_PORT),
    dialect: 'postgres',
  },
}
