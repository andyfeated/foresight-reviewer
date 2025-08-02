import express from 'express'
import { UserController } from '../controllers/userController'

const router = express.Router()

const userController: UserController = new UserController

router.get('/', userController.getUser.bind(userController))

export default router