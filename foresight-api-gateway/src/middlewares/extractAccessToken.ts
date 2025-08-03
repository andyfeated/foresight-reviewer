/* eslint-disable @typescript-eslint/no-namespace */
 
import { Request, Response, NextFunction} from 'express'

declare global {
  namespace Express {
    interface Request {
      gitlabAccessToken?: string
    }
  }
}

export default function extractAccessToken(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.cookies.gitlab_access_token;

  if (accessToken?.trim()) {
    req.gitlabAccessToken = accessToken
  } else {
    req.gitlabAccessToken = undefined
  }

  next()
}