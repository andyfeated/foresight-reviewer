/* eslint-disable @typescript-eslint/no-explicit-any */
interface ReviewPullRequestPayload {
  pullRequestUrl: string;
}

export class ReviewService {
  public async reviewPullRequest(payload: ReviewPullRequestPayload) {
    try {
      const pullRequestUrl = payload.pullRequestUrl;

      const pullRequestResponse = await fetch(pullRequestUrl)

      const responseStatus = pullRequestResponse.status

      if (responseStatus === 403) {
        // private
      } else if (responseStatus === 200) {
        // public
      } else {
        // fallback
      }
      
      return { success: true }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }
}