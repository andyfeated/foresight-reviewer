/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response} from 'express'
import { AuthService } from "../services/authService";

export class AuthController {
  private authService: AuthService;
  private clientBaseUrl: string;

  constructor() {
    this.authService = new AuthService()
    this.clientBaseUrl = process.env.CLIENT_BASE_URL as string;
  }

  public async gitlabCallbackHandler(req: Request, res: Response) {
    const { code, state } = req.query

    try {
      const token = await this.authService.exchangeCodeForToken(code as string)

      const accessToken = token.access_token
      const expiresIn = token.expires_in
      
      const decodedState = this.authService.decodeState(state as string)

      // adds Set-Cookie header to response
      res.cookie('gitlab_access_token', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: expiresIn * 1000,
        path: '/'
      })

      res.status(200).redirect(`${this.clientBaseUrl}/review?prUrl=${encodeURIComponent(decodedState.prUrl)}`)
    } catch(err: any) {
      console.log('Failed to get access token', err.message)

      res.status(400).redirect(`${this.clientBaseUrl}/?error=oauth_failed`)
    }
  }

  public async getStatus(req: Request, res: Response) {
    const accessToken = req.gitlabAccessToken as string

    try {
      const statusData = await this.authService.getStatus(accessToken)

      res.status(200).json(statusData)
    } catch(err: any) {
      res.status(400).json({ error: err.message })
    }
  }

  public async logout(req: Request, res: Response) {
    const accessToken = req.gitlabAccessToken as string

    try {
      await this.authService.logout(accessToken)

      res.clearCookie('gitlab_access_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/'
      })

      res.status(200).json({ success: true })
    } catch(err: any) {      
      res.status(400).json({ error: err.message })
    }
  }
}
