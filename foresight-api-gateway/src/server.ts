import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import extractAccessToken from './middlewares/extractAccessToken'
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware'
import reviewRoutes from './routes/reviewRoutes'
import authRoutes from './routes/authRoutes'

const app = express()

dotenv.config()

app.use(express.json())
app.use(cors({
  origin: process.env.CLIENT_BASE_URL,
  credentials: true
}))
app.use(cookieParser())

app.use(extractAccessToken)

app.get('/health', async (req, res) => {
  res.json({ status: 'API Gateway is running' })
})

app.use('/api/review', reviewRoutes)
app.use('/api/auth', authRoutes)

app.use('/api/gitlab', createProxyMiddleware({
  target: process.env.GITLAB_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/gitlab': ''
  },
  on: {
    proxyReq: fixRequestBody
  }
}))

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`)
})