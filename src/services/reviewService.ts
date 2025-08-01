import { AuthService } from "./authService";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ReviewPullRequestPayload {
  pullRequestUrl: string;
}

export class ReviewService {
  private gitlabServiceBaseUrl: string;
  private authService: AuthService;

  constructor() {
    this.gitlabServiceBaseUrl = process.env.GITLAB_SERVICE_URL as string;
    this.authService = new AuthService()
  }
  
  public async reviewPullRequest(payload: ReviewPullRequestPayload) {
    try {
      const pullRequestUrl = payload.pullRequestUrl;

      const pullRequestResponse = await fetch(`${this.gitlabServiceBaseUrl}/pr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ pullRequestUrl })
      })

      const pullRequestData = await pullRequestResponse.json()

      const pullRequestStatus = pullRequestData.status
     
      if (pullRequestStatus === 200) {
        return {
          authRequired: false
        }
      } else if (pullRequestStatus === 404) {
        const payload = { prUrl: pullRequestUrl }

        const oauthUrl = this.authService.buildGitlabOAuthUrl(payload)
        
        return {
          authRequired: true,
          oauthUrl
        }
      } else {
        return {
          error: 'Unkown status code'
        }
      }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }
}