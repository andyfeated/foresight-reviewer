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

    try {
      const token = await this.authService.exchangeCodeForToken(code as string)
      const decodedState = this.authService.decodeState(state as string)

      const postMessageHtml = this.authService.buildPostMessageHtml(token, decodedState.prUrl)

      res.send(postMessageHtml)
    } catch(err: any) {
      res.status(400).json({ error: err.message })
    }
  }
}
