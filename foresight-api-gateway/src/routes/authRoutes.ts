import express from 'express'
import { AuthController } from '../controllers/authController'

const router = express.Router()

const authController: AuthController = new AuthController()

router.get('/gitlab/callback', authController.gitlabCallbackHandler.bind(authController))
router.get('/status', authController.getStatus.bind(authController))
router.post('/logout', authController.logout.bind(authController))

export default router