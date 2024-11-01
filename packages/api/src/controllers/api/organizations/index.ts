import { Request, Response } from 'express'
import { OrganizationService } from '../../../services'

class OrganizationController {
  // Create an organization
  static async createOrganization(req: Request, res: Response): Promise<void> {
    try {
      const organization = await OrganizationService.createOrganization(
        req.body,
      )
      res.status(201).json(organization)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  // Get all organizations
  static async getAllOrganizations(req: Request, res: Response): Promise<void> {
    try {
      const organizations = await OrganizationService.getAllOrganizations()
      res.status(200).json(organizations)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  // Get organization by ID
  static async getOrganizationById(req: Request, res: Response): Promise<void> {
    try {
      const organization = await OrganizationService.getOrganizationById(
        req.params.id,
      )
      if (!organization) {
        res.status(404).json({ message: 'Organization not found' })
      }
      res.status(200).json(organization)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  // Update organization by ID
  static async updateOrganization(req: Request, res: Response): Promise<void> {
    try {
      const organization = await OrganizationService.updateOrganization(
        req.params.id,
        req.body,
      )
      if (!organization) {
        res.status(404).json({ message: 'Organization not found' })
      }
      res.status(200).json(organization)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  // Delete organization by ID
  static async deleteOrganization(req: Request, res: Response): Promise<void> {
    try {
      const organization = await OrganizationService.deleteOrganization(
        req.params.id,
      )
      if (!organization) {
        res.status(404).json({ message: 'Organization not found' })
      }
      res.status(200).json({ message: 'Organization deleted successfully' })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}

export default OrganizationController
