import { Router } from 'express'
import { UserController } from '../../../controllers'

const router = Router()

router.post('/', UserController.createUser)
router.get('/', UserController.getAllUsers)
router.get('/:id', UserController.getUserById)
router.put('/:id', UserController.updateUser)
router.delete('/:id', UserController.deleteUser)

export default router
