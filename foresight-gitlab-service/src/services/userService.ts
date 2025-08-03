export class UserService {
  private gitlabApiBaseUrl: string;

  constructor() {
    this.gitlabApiBaseUrl = process.env.GITLAB_API_BASE_URL as string;
  }

  public async getUser(accessToken?: string) {
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

      const data = await response.json()
      return { status: response.status, data }
    } catch (err: any) {
      throw new Error(`Failed to fetch user details: ${err.message}`)
    }
  }
}