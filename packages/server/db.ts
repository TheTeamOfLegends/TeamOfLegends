import { Client } from 'pg'

const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_PORT } =
  process.env

const PG_PORT = POSTGRES_PORT || 5432

export const createClientAndConnect = async (): Promise<Client | null> => {
  try {
    const client = new Client({
      user: POSTGRES_USER,
      host: 'localhost',
      database: POSTGRES_DB,
      password: POSTGRES_PASSWORD,
      port: Number(POSTGRES_PORT),
    })

    await client.connect()

    const res = await client.query('SELECT NOW()')
    console.log('  ➜ 🎸 Connected to the database at:', res?.rows?.[0].now)
    client.end()

    return client
  } catch (e) {
    console.error(
      '  ➜ 🎸 Database is not available on localhost:%s. Start Postgres, e.g. `docker compose up postgres -d`',
      PG_PORT
    )
    console.error(e)
  }

  return null
}
