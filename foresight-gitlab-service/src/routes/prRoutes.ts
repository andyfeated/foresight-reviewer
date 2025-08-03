import express from 'express'
import { PrController } from '../controllers/prController'

const router = express.Router()

const prController: PrController = new PrController()

router.post('/', prController.pullRequest.bind(prController))

export default router