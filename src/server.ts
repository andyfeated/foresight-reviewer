import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { createProxyMiddleware } from 'http-proxy-middleware'
import reviewRoutes from './routes/reviewRoutes'

const app = express()

dotenv.config()

app.use(express.json())
app.use(cors())

app.get('/health', async (req, res) => {
  res.json({ status: 'API Gateway is running' })
})

app.use('/api/review', reviewRoutes)

app.use('/api/gitlab', createProxyMiddleware({
  target: process.env.GITLAB_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/gitlab': ''
  }
}))

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`)
})