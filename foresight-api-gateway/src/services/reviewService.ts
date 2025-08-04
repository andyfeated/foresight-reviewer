import { AuthService } from "./authService";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ReviewPayload {
  pullRequestUrl: string;
}

interface CheckAccessPayload {
  pullRequestUrl: string;
}

export class ReviewService {
  private gitlabServiceBaseUrl: string;
  private authService: AuthService;

  constructor() {
    this.gitlabServiceBaseUrl = process.env.GITLAB_SERVICE_URL as string;
    this.authService = new AuthService()
  }

  public async review(payload: ReviewPayload, accessToken?: string) {
    try {
      const pullRequestUrl = payload.pullRequestUrl
      
      const pullRequestResponse = await fetch(`${this.gitlabServiceBaseUrl}/pr`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Gitlab-Api-Token': accessToken ?? ''
        }, 
        body: JSON.stringify({ pullRequestUrl })
      })

      if (!pullRequestResponse.ok) {
        const data = await pullRequestResponse.json()
        throw new Error(data.error)
      }

      const data = await pullRequestResponse.json()

      return data
    } catch (err: any) {
      throw new Error(err.message)
    }
  }
  
  public async checkAccess(payload: CheckAccessPayload) {
    try {
      const pullRequestUrl = payload.pullRequestUrl;

      const pullRequestResponse = await fetch(`${this.gitlabServiceBaseUrl}/pr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ pullRequestUrl })
      })

      const pullRequestStatus = pullRequestResponse.status
     
      if (pullRequestStatus === 200) {
        return {
          authRequired: false
        }
      } else if (pullRequestStatus === 400) {
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