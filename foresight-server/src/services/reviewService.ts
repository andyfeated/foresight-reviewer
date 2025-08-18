import { AuthService } from "./authService";
import { GitlabService } from "./gitlabService";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ReviewPayload {
  pullRequestUrl: string;
}

interface CheckAccessPayload {
  pullRequestUrl: string;
}

export class ReviewService {
  private authService: AuthService;
  private gitlabService: GitlabService;

  constructor() {
    this.authService = new AuthService()
    this.gitlabService = new GitlabService()
  }

  public async review(payload: ReviewPayload, accessToken?: string) {
    try {
      const pullRequestUrl = payload.pullRequestUrl
      
      const pullRequestResponse = await this.gitlabService.getPullRequest(pullRequestUrl, accessToken)

      if (!pullRequestResponse.ok && !accessToken?.trim()) {
        throw new Error('PR is either private or does not exist. Please login via OAuth to continue')
      }

      if (!pullRequestResponse.ok) {
        throw new Error('PR either does not exist or your account does not have access to it')
      }

      if (!pullRequestResponse.ok) {
        const data = await pullRequestResponse.json()
        throw new Error(data.error)
      }

      const pullRequestData = await pullRequestResponse.json()

      return pullRequestData
    } catch (err: any) {
      throw new Error(err.message)
    }
  }
  
  public async checkAccess(payload: CheckAccessPayload, accessToken?: string) {
    try {
      const pullRequestUrl = payload.pullRequestUrl;

      // need to pass access token here to use it if already logged in
      // instead of executing oauth again

      const pullRequestResponse = await this.gitlabService.getPullRequest(pullRequestUrl, accessToken)

      const pullRequestStatus = pullRequestResponse.status
           
      if (pullRequestStatus === 200) {
        return {
          authRequired: false,
          hasAccessToPR: true,
        }
      } else if (pullRequestStatus === 404 && accessToken) {
        return {
          authRequired: false,
          hasAccessToPR: false
        }
      } else if (pullRequestStatus === 404 && !accessToken) {
        const payload = { prUrl: pullRequestUrl }

        const oauthUrl = this.authService.buildGitlabOAuthUrl(payload)
        
        return {
          authRequired: true,
          hasAccessToPR: false,
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