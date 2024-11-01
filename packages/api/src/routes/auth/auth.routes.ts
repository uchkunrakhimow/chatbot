import { Router, Request, Response } from 'express'
import { AuthController } from '../../controllers'
import Authenticate from '../../middleware/authenticate.middleware'

const { login, register, refresh } = AuthController

const router: any = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refresh)

router.get('/protected', Authenticate, (req: Request, res: Response) => {
  res.status(200).json({ message: 'Protected route' })
})

export default router
