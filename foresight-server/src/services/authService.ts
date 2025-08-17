import { GitlabService } from "./gitlabService";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface StatePayload {
  prUrl: string;
}

export class AuthService {
  private clientId: string
  private clientSecret: string
  private redirectUrl: string
  private gitlabService: GitlabService;

  constructor() {
    this.clientId = process.env.AUTH_GITLAB_CLIENT_ID as string
    this.clientSecret = process.env.AUTH_GITLAB_CLIENT_SECRET as string
    this.redirectUrl = process.env.AUTH_GITLAB_REDIRECT_URL as string
    this.gitlabService = new GitlabService()
  }

  public buildGitlabOAuthUrl(payload: StatePayload): string {
    const encodedState = Buffer.from(JSON.stringify(payload)).toString('base64url')

    const urlParams = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUrl,
      response_type: 'code',
      scope: 'read_api read_user',
      state: encodedState,
    })
    
    const oauthUrl = `https://gitlab.com/oauth/authorize?${urlParams.toString()}`
    
    return oauthUrl
  }

  public async exchangeCodeForToken(code: string) {    
    const oauthTokenUrl = `https://gitlab.com/oauth/token` 

    try {
      const body = new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUrl
      })

      const res = await fetch(oauthTokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body,
      })

      if(!res.ok) {
        throw new Error('Failed to exchange code')
      }

      const data = await res.json()
      
      return data
    } catch (err: any) {      
      throw Error(err.message)
    }
  }

  public decodeState(state: string) {
    const decoded = Buffer.from(state, 'base64url').toString('utf-8')
    return JSON.parse(decoded)
  }

  public async getStatus(accessToken: string) {
    try {
      if (!accessToken) {
        return {
          isLoggedIn: false,
          data: null
        }
      }
      
      const gitlabUserResponse = await this.gitlabService.getUser(accessToken)
      
      if (!gitlabUserResponse.ok) {
        throw new Error('Failed fetching gitlab user')
      }

      const data = await gitlabUserResponse.json()
      
      return {
        isLoggedIn: true,
        id: data.id,
        name: data.name,
        avatar: data.avatar_url
      }
    } catch (err: any) {
      throw new Error(err.message)
    }
  }

  public async logout(accessToken: string) {
    try {
      const body = new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        token: accessToken
      })

      const revokeUrl = 'https://gitlab.com/oauth/revoke'

      const res = await fetch(revokeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body,
      })

      if (!res.ok) {
        throw new Error('Failed to revoke token')
      }

      return res
    } catch (err: any) {
      throw new Error(err.message)
    }
  }
}