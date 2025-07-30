import { PrService } from "../services/prService";
import { Request, Response } from 'express'
import { z } from 'zod'

const PullRequestPayloadSchema = z.object({
  pullRequestUrl: z.url()
})

export class PrController {
  private prService: PrService

  constructor() {
    this.prService = new PrService()
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

  public async pullRequest(req: Request, res: Response) {
    console.log('abc')
    const parseResult = PullRequestPayloadSchema.safeParse(req.body)

    console.log('here1')
    if (!parseResult.success) {
      return res.status(400).json({ 
        error: 'Invalid Input', details: parseResult.error 
      })
    }
    console.log('here2')

    const { pullRequestUrl } = req.body

    if (!this.isValidGitlabPRUrl(pullRequestUrl)) {
      return res.status(400).json({ error: 'Invalid Gitlab URL' })
    }

    try {
      const pullRequestResponse = await this.prService.pullRequest(pullRequestUrl)

      res.status(201).json(pullRequestResponse)
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }
}