import { verify, sign } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

const jwtAccessSecret = process.env.JWT_ACCESS_SECRET_KEY!
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET_KEY!
const jwtAccessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN!

interface CustomRequest extends Request {
  user?: any
}

const AuthenticateMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): void => {
  const accessToken: string | any = req.headers['authorization']?.split(' ')[1] // Split for 'Bearer token'
  const refreshToken = req.cookies['refreshToken']

  // Check if tokens are provided
  if (!accessToken && !refreshToken) {
    res.status(401).send('Access Denied. No token provided.')
  }

  // Try to verify the access token
  try {
    const decoded = verify(accessToken, jwtAccessSecret)
    req.user = decoded // Attach decoded user information to request
    next()
  } catch (error) {
    // Access token is invalid; check for refresh token
    if (!refreshToken) {
      res.status(401).send('Access Denied. No refresh token provided.')
    }

    // Attempt to verify the refresh token
    try {
      const decoded = verify(refreshToken, jwtRefreshSecret)
      const newAccessToken = sign({ user: decoded }, jwtAccessSecret, {
        expiresIn: jwtAccessExpiresIn,
      })

      // Set the new access token in the response header
      res
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'strict',
        })
        .header('Authorization', newAccessToken)
        .send(decoded) // Sending the decoded user information
    } catch (error) {
      res.status(400).send('Invalid Token.')
    }
  }
}

export default AuthenticateMiddleware
