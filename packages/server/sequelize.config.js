const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_HOST,
  POSTGRES_PORT,
} = process.env

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
}
