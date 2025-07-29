import express from 'express'
import { ReviewController } from '../controllers/reviewController'

const router = express.Router()

const reviewController: ReviewController = new ReviewController()

router.post('/', reviewController.reviewPullRequest.bind(reviewController))

export default router