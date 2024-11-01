import { Request, Response } from 'express'
import { UserService, TokenService } from '../../services/'

const jwtAccessSecret = process.env.JWT_ACCESS_SECRET_KEY!
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET_KEY!
const jwtAccessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '1h'
const jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '30d'

class AuthController {
  /**
   * Handles user login by validating credentials and issuing JWT tokens.
   */
  static async login(req: Request, res: Response): Promise<Response> {
    try {
      const { username, password } = req.body

      if (!username || !password) {
        return res.status(400).json({ error: 'Missing credentials' })
      }

      // Validate user credentials
      const user: any = await UserService.validateUserCredentials(
        username,
        password,
      )
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      const tokenPayload = {
        sub: user._id.toString(),
        username: user.username,
        role: user.role,
      }

      const accessToken = TokenService.generateToken(
        tokenPayload,
        jwtAccessSecret,
        jwtAccessExpiresIn,
      )
      const refreshToken = TokenService.generateToken(
        tokenPayload,
        jwtRefreshSecret,
        jwtRefreshExpiresIn,
      )

      return res
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'strict',
        })
        .header('Authorization', accessToken)
        .json({
          message: 'Login successful',
          user: { id: user._id, username: user.username, role: user.role },
        })
    } catch (error: unknown) {
      return res.status(500).json({
        error: 'Login failed',
        details: (error as Error).message,
      })
    }
  }

  /**
   * Handles user registration by creating a new user account.
   */
  static async register(req: Request, res: Response): Promise<Response> {
    const { name, username, role, password } = req.body

    if (!name || !username || !role || !password) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    try {
      const allowedRoles = ['admin', 'user']

      // Validate role
      if (!UserService.isValidRole(role, allowedRoles)) {
        return res.status(400).json({
          error: 'Invalid role',
          allowedRoles: allowedRoles,
        })
      }

      // Check if user already exists
      const existingUser = await UserService.getUserByUsername(username)
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' })
      }

      // Create user
      const newUser: any = await UserService.createUser(req.body)
      const userResponse = newUser.toObject()
      delete userResponse.password

      return res.status(201).json({
        message: 'User registered successfully',
        user: userResponse,
      })
    } catch (error: unknown) {
      return res.status(500).json({
        error: 'Registration failed',
        details: (error as Error).message,
      })
    }
  }

  /**
   * Refreshes the JWT access token using the refresh token.
   */
  static async refresh(req: Request, res: Response): Promise<Response> {
    const refreshToken = req.body.refreshToken

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is missing' })
    }

    try {
      const decoded = TokenService.verifyToken(refreshToken, jwtRefreshSecret)

      const accessToken = TokenService.generateToken(
        { user: decoded },
        jwtAccessSecret,
        jwtAccessExpiresIn,
      )

      return res
        .header('Authorization', accessToken)
        .status(200)
        .json({ user: decoded })
    } catch (error: unknown) {
      return res.status(400).json({
        error: 'Invalid refresh token',
        details: (error as Error).message,
      })
    }
  }
}

export default AuthController
