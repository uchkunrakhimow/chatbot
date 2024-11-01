import { Router } from 'express'
import { organizationsRouter, supervisorsRouter, usersRouter } from './api'

const router = Router()

router.use('/org', organizationsRouter)
router.use('/supervisor', supervisorsRouter)
router.use('/users', usersRouter)

export default router
