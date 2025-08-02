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
}
