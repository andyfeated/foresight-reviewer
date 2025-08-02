import { UserService } from "../services/userService";
import { Request, Response } from 'express'

export class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  public async getUser(req: Request, res: Response) {
    try {
      const userResponse = await this.userService.getUser(req.gitlabAccessToken)

      res.status(201).json(userResponse)
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }
}