 
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

  public async reviewPullRequest(req: Request, res: Response) {
    const parseResult = ReviewPullRequestPayloadSchema.safeParse(req.body)

    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid Input', details: parseResult.error })
    }
    
    const { pullRequestUrl } = req.body

    if (!this.isValidGitlabPRUrl(pullRequestUrl)){
      return res.status(400).json({ error: 'Invalid Gitlab URL' })
    }

    try {
      const reviewResponse = await this.reviewService.reviewPullRequest({ pullRequestUrl })

      res.status(201).json(reviewResponse)
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }
}