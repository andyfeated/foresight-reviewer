interface PrRequestPayload {
  pullRequestUrl: string
}

export class PrService {
  private gitlabApiBaseUrl: string;

  constructor() {
    this.gitlabApiBaseUrl = process.env.GITLAB_API_BASE_URL as string
  }

  private extractProjectId(url: string) {
    // https://gitlab.com/alougovs/useful-gemini/-/merge_requests/1
    const gitlabBaseUrl = 'https://gitlab.com/'
  }
  
  public async pullRequest(payload: PrRequestPayload) {
    try {
      // https://gitlab.com/alougovs/useful-gemini/-/merge_requests/1
      const pullRequestUrl = payload.pullRequestUrl

      return { success: true }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }
}