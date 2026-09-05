import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import status from 'http-status'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })
// В Docker-образе .env нет: креды приходят только из environment / env_file

import express, { ErrorRequestHandler, Router } from 'express'
import { createClientAndConnect, sequelize } from './db'
import forumRouter from './src/routes/forumRouter'
import authMiddleware from './src/middleware/authMiddleware'
import { useThemeRoutes } from './src/features/theme'
import { ServerError } from './shared/errors'

const app = express()
app.use(cors())
app.use(express.json())
const port = Number(process.env.SERVER_PORT) || 3001

createClientAndConnect()

app.get('/friends', (_, res) => {
  res.json([
    { name: 'Саша', secondName: 'Панов' },
    { name: 'Лёша', secondName: 'Садовников' },
    { name: 'Серёжа', secondName: 'Иванов' },
  ])
})

app.get('/user', (_, res) => {
  res.json({ name: '</script>Степа', secondName: 'Степанов' })
})

app.get('/', (_, res) => {
  res.json('👋 Howdy from the server :)')
})

/** Liveness/readiness для Docker healthcheck */
app.get('/health', async (_req, res) => {
  try {
    await sequelize.query('SELECT 1')
    res.status(200).json({ status: 'ok' })
  } catch {
    res.status(503).json({ status: 'db_unavailable' })
  }
})

app.use('/forum', authMiddleware, forumRouter)

const themeRouter: Router = Router()

useThemeRoutes(themeRouter)

app.use(themeRouter)

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- 4-й параметр необходим для регистрации
const handleError: ErrorRequestHandler = (err, _req, res, _next) => {
  const body = {
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  }

  if (err instanceof ServerError) {
    return res.status(err.statusCode).json(body)
  }

  return res.status(status.INTERNAL_SERVER_ERROR).json(body)
}

app.use(handleError)

app.listen(port, () => {
  console.log(`  ➜ 🎸 Server is listening on port: ${port}`)
})
