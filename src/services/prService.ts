interface PrRequestPayload {
  pullRequestUrl: string
}

export class PrService {
  private gitlabApiBaseUrl: string;

  constructor() {
    this.gitlabApiBaseUrl = process.env.GITLAB_API_BASE_URL as string
  }

  private extractProjectId(url: string) {
    // https://gitlab.com/user/project/-/merge_requests/1
    const gitlabBaseUrl = 'https://gitlab.com/'
    const trimmedUrl = url.replace(gitlabBaseUrl, '')

    const splittedUrl = trimmedUrl.split('/')
    splittedUrl.splice(-3)

    const projectId = splittedUrl.join('/')

    return projectId
  }

  private extractMergeRequestId(url: string) {
    const splittedUrl = url.split('/')
    return splittedUrl.pop()
  }
  
  public async pullRequest(payload: PrRequestPayload) {
    try {
      const pullRequestUrl = payload.pullRequestUrl

      const projectId = this.extractProjectId(pullRequestUrl)
      const encodedProjectId = encodeURIComponent(projectId)

      const mergeRequestId = this.extractMergeRequestId(pullRequestUrl)
      
      const mergeRequestEndpoint = `${this.gitlabApiBaseUrl}/projects/${encodedProjectId}/merge_requests/${mergeRequestId}`

      const response = await fetch(mergeRequestEndpoint)

      const data = await response.json()
      
      return { status: response.status, data }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }
}