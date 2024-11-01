import express, { Application, Request, Response } from 'express'
import { connect } from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import { config } from 'dotenv'
import cookieParser from 'cookie-parser'

import authRoute from './routes/auth/auth.routes'
import apiRoute from './routes/api.routes'

// import Authenticate from './middleware/authenticate.middleware'

config()

const app: Application = express()
const PORT = process.env['PORT']!
const MONGO_URL = process.env['MONGO_URL']!

app.use(cors())
app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req: Request, res: Response) => {
  res.send('Happy coding!')
})

app.use('/auth', authRoute)
app.use('/api', apiRoute)

// Start server
const startServer = async () => {
  try {
    await connect(MONGO_URL as string)
    console.log('Connected to MongoDB')
    app.listen(PORT, () =>
      console.log(`Server started on http://localhost:${PORT}`),
    )
  } catch (error) {
    console.error(
      'Failed to start server:',
      error instanceof Error ? error.message : error,
    )
    process.exit(1)
  }
}

startServer()
