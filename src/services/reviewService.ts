/* eslint-disable @typescript-eslint/no-explicit-any */
interface ReviewPullRequestPayload {
  pullRequestUrl: string;
}

export class ReviewService {
  private gitlabServiceBaseUrl: string;

  constructor() {
    this.gitlabServiceBaseUrl = process.env.GITLAB_SERVICE_URL as string;
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

     
      console.log(pullRequestData.status)
      if (pullRequestStatus === 200) {
        console.log('public repo')
      } else if (pullRequestStatus === 404) {
        console.log('private repo or does not exist')
      }
      
      return { success: true }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }
}