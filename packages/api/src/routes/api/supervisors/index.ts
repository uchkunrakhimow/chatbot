import { Router } from 'express'
import { SupervisorController } from '../../../controllers'

const {
  createSupervisor,
  getAllSupervisors,
  getSupervisorById,
  updateSupervisor,
  deleteSupervisor,
} = SupervisorController

const router = Router()

// Route for creating a supervisor and getting all supervisors
router.route('/').post(createSupervisor).get(getAllSupervisors)

// Route for getting, updating, and deleting a supervisor by ID
router
  .route('/:id')
  .get(getSupervisorById)
  .put(updateSupervisor)
  .delete(deleteSupervisor)

export default router
