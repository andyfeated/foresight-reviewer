import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import prRoutes from './routes/prRoutes'
import userRoutes from './routes/userRoutes'
import extractAccessToken from './middlewares/extractAccessToken'

const app = express()

dotenv.config()

app.use(express.json())
app.use(cors())

app.use(extractAccessToken)

app.get('/health', (req, res) => {
  res.json({ status: 'Gitlab Service is running' })
})

app.use('/pr', prRoutes)
app.use('/user', userRoutes)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Gitlab Service is running on port ${PORT}`)
})