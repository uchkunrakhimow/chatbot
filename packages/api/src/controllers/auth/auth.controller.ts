import { Request, Response } from 'express'
import TokenService from '../../services/token.service'
import UserService from '../../services/user.service'

const jwtAccessSecret = process.env.JWT_ACCESS_SECRET_KEY!
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET_KEY!
const jwtAccessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN! || '1h'
const jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN! || '30d'

/**
 * Handles user login by validating credentials and issuing JWT tokens.
 */
export async function login(req: any, res: Response): Promise<Response> {
  try {
    const { username, password, token } = req.body

    res.cookie('user-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 240, // 10 day
    })

    if (!username || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
      })
    }

    // Validate user credentials
    const user: any = await UserService.validateUserCredentials(
      username,
      password,
    )
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
      })
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
      .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
      .header('Authorization', accessToken)
      .json({
        message: 'Login successful',
        user: { id: user._id, username: user.username, role: user.role }
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
export async function register(req: Request, res: Response): Promise<Response> {
  const { name, username, role, password } = req.body

  if (!name || !username || !role || !password) {
    return res.status(400).json({
      error: 'All fields are required',
    })
  }

  try {
    const allowedRoles = [
      'admin',
      'user'
    ]

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
      return res.status(409).json({
        error: 'User already exists',
      })
    }

    // Create user
    const newUser: any = await UserService.createUser(req.body)
    return res.status(201).json({
      message: 'User registered successfully',
      userId: newUser(-password),
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
export async function refresh(req: Request, res: Response): Promise<Response> {
  const refreshToken: any = req.body.refreshToken

  if (!refreshToken) {
    return res.status(400).json({
      error: 'Refresh token is missing',
    })
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
              .status(200).json({ user: decoded })
  } catch (error: unknown) {
    return res.status(400).json({
      error: 'Invalid refresh token',
    })
  }
}