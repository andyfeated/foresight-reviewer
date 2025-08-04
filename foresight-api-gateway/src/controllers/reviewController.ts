 
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReviewService } from "../services/reviewService";
import { Request, Response} from 'express'
import { z } from 'zod'

const ReviewPullRequestPayloadSchema = z.object({
  pullRequestUrl: z.url()
})

export class ReviewController {
  private reviewService: ReviewService

  constructor() {
    this.reviewService = new ReviewService()
  }
 
  private isValidGitlabPRUrl(url: string): boolean {
    try {
      const parsed = new URL(url);

      if (!parsed.hostname.includes('gitlab.com')) return false;

      // Match GitLab MR path ending in `/-/merge_requests/{number}`
      const regex = /\/-\/merge_requests\/\d+$/;
      return regex.test(parsed.pathname);
    } catch {
      return false;
    }
  }

  public async review(req: Request, res: Response) {
    const parseResult = ReviewPullRequestPayloadSchema.safeParse(req.body)

    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid Input', details: parseResult.error })
    }
    
    const { pullRequestUrl } = req.body

    if (!this.isValidGitlabPRUrl(pullRequestUrl)){
      return res.status(400).json({ error: 'Invalid Gitlab URL' })
    }

    try {
      const accessToken = req.gitlabAccessToken as string
      
      const reviewResponse = await this.reviewService.review({ pullRequestUrl }, accessToken)
      const reviewData = reviewResponse.data

      const data = {
        id: reviewData.id,
        title: reviewData.title,
        description: reviewData.description
      }
      res.status(200).json({ success: true, data })
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }

  public async checkAccess(req: Request, res: Response) {
    const parseResult = ReviewPullRequestPayloadSchema.safeParse(req.body)

    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid Input', details: parseResult.error })
    }
    
    const { pullRequestUrl } = req.body

    if (!this.isValidGitlabPRUrl(pullRequestUrl)){
      return res.status(400).json({ error: 'Invalid Gitlab URL' })
    }

    try {
      const checkAccessResponse = await this.reviewService.checkAccess({ pullRequestUrl })

      res.status(201).json(checkAccessResponse)
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }
}