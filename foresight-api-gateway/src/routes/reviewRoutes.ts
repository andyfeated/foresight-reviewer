import express from 'express'
import { ReviewController } from '../controllers/reviewController'

const router = express.Router()

const reviewController: ReviewController = new ReviewController()

router.post('/check-access', reviewController.checkAccess.bind(reviewController))
router.post('/', reviewController.review.bind(reviewController))

export default router