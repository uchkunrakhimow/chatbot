import { Router } from 'express'
import { OrganizationController } from '../../../controllers'

const {
  createOrganization,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
} = OrganizationController

const router = Router()

// Route for creating a organizations and getting all organizationss
router.route('/').post(createOrganization).get(getAllOrganizations)

// Route for getting, updating, and deleting a organization by ID
router
  .route('/:id')
  .get(getOrganizationById)
  .put(updateOrganization)
  .delete(deleteOrganization)

export default router
