/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response} from 'express'
import { AuthService } from "../services/authService";

export class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  public async gitlabCallbackHandler(req: Request, res: Response) {
    const { code, state } = req.query
    console.log('code and state', code, state)

    try {
      const token = await this.authService.exchangeCodeForToken(code as string)
      const decodedState = this.authService.decodeState(state as string)

      const postMessageHtml = this.authService.buildPostMessageHtml(token, decodedState.prUrl)

      res.status(200).send(postMessageHtml)
    } catch(err: any) {
      const postMessageHtml = this.authService.buildPostMessageHtml(null, null, false)

      console.log('Failed to get access token', err.message)

      res.status(400).send(postMessageHtml)
    }
  }
}
