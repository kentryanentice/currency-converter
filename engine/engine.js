import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import ApiRoutes from './routes/ApiRoutes.js'

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:4000', credentials: true }))

app.use(helmet())

dotenv.config({ path: "./engine/.env" })

app.use(express.json())

app.use('/', ApiRoutes)

const port = process.env.PORT || 4500

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})