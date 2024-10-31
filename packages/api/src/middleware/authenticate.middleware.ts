import jwt from "jsonwebtoken";
const secretKey = 'secret_key';
import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  user?: any;
}

export const authenticate = (req: CustomRequest, res: Response, next: NextFunction) => {
  const accessToken = req.headers['authorization']!;
  const refreshToken = req.cookies['refreshToken']!;

  if (!accessToken && !refreshToken) {
    return res.status(401).send('Access Denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(accessToken, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    if (!refreshToken) {
      return res.status(401).send('Access Denied. No refresh token provided.');
    }

    try {
      const decoded = jwt.verify(refreshToken, secretKey);
      const accessToken = jwt.sign({ user: decoded }, secretKey, { expiresIn: '1h' });

      res
        .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
        .header('Authorization', accessToken)
        .send(decoded);
    } catch (error) {
      return res.status(400).send('Invalid Token.');
    }
  }
};