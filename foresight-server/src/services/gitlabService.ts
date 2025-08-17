/* eslint-disable @typescript-eslint/no-explicit-any */
export class GitlabService {
  private gitlabApiBaseUrl: string;

  constructor() {
    this.gitlabApiBaseUrl = process.env.GITLAB_API_BASE_URL as string
  }

  private extractProjectId(url: string) {
    // from: https://gitlab.com/user/project/-/merge_requests/1
    // to: user/project
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
  
  public async getUser(accessToken?: string): Promise<Response> {
    if (!accessToken) {
      throw new Error('Access token is missing')
    }

    const userEndpoint = `${this.gitlabApiBaseUrl}/user`
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }

    try {
      const response = await fetch(userEndpoint, { headers })

      return response
    } catch (err: any) {
      throw new Error(`Failed to fetch user details: ${err.message}`)
    }
  }

  public async getPullRequest(pullRequestUrl: string, accessToken?: string | undefined): Promise<Response> {
    try {
      const projectId = this.extractProjectId(pullRequestUrl)
      const encodedProjectId = encodeURIComponent(projectId)

      const mergeRequestId = this.extractMergeRequestId(pullRequestUrl)

      const mergeRequestEndpoint = `${this.gitlabApiBaseUrl}/projects/${encodedProjectId}/merge_requests/${mergeRequestId}`

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`
      }

      const response = await fetch(
        mergeRequestEndpoint,
        { headers }
      )

      return response
    } catch (error: any) {
      throw new Error(`Failed to fetch pull request details: ${error.message}`)
    }
  }
}