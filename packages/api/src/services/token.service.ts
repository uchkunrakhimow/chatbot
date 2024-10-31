import { sign, verify } from 'jsonwebtoken'

class TokenService {
  /**
   * Generate a JWT token.
   * @param payload - Payload to encode
   * @param secret - Secret key to sign token
   * @param expiresIn - Token expiration time
   */
  static generateToken(
    payload: any,
    secret: string,
    expiresIn: string,
  ): string {
    return sign(payload, secret, { expiresIn })
  }

  /**
   * Verify a JWT token.
   * @param token - JWT token to verify
   * @param secret - Secret key to verify against
   */
  static verifyToken(token: string, secret: string): any {
    return verify(token, secret)
  }
}

export default TokenService