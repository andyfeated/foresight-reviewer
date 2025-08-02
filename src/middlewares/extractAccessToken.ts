import { Request, Response, NextFunction} from 'express'

declare global {
  namespace Express {
    interface Request {
      gitlabAccessToken?: string
    }
  }
}

export default function extractAccessToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    req.gitlabAccessToken = authHeader.split(' ')[1]
  } else {
    req.gitlabAccessToken = undefined
  }

  next()
}