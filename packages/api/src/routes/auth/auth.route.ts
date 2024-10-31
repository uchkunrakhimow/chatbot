import { Router, Request, Response } from 'express'
import { AuthController } from '../../controllers'
import { authenticate } from './../../middleware/authenticate.middleware';

const router: any = Router()

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/refresh', AuthController.refresh)

router.get('/protected', authenticate, (req: Request, res: Response) => {
  res.status(200).json({ message: 'Protected route' })
})

export default router