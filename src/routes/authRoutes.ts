import express from 'express'
import { AuthController } from '../controllers/authController'

const router = express.Router()

const authController: AuthController = new AuthController()

router.get('/gitlab/callback', authController.gitlabCallbackHandler.bind(authController))

export default router