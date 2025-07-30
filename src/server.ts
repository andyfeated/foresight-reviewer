import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import prRoutes from './routes/prRoutes'

const app = express()

dotenv.config()

app.use(express.json())
app.use(cors())

app.get('/health', (req, res) => {
  res.json({ status: 'Gitlab Service is running' })
})

app.use('/pr', prRoutes)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Gitlab Service is running on port ${PORT}`)
})