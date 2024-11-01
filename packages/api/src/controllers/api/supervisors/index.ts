import { Request, Response } from 'express'
import { SupervisorService } from '../../../services'

class SupervisorController {
  // Create Supervisor
  static async createSupervisor(req: Request, res: Response): Promise<void> {
    try {
      const supervisor = await SupervisorService.createSupervisor(req.body)
      res.status(201).json(supervisor)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  // Get All Supervisors
  static async getAllSupervisors(req: Request, res: Response): Promise<void> {
    try {
      const supervisors = await SupervisorService.getAllSupervisors()
      res.status(200).json(supervisors)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  // Get Supervisor by ID
  static async getSupervisorById(req: Request, res: Response): Promise<void> {
    try {
      const supervisor = await SupervisorService.getSupervisorById(
        req.params.id,
      )
      if (!supervisor) {
        res.status(404).json({ message: 'Supervisor not found' })
        return
      }
      res.status(200).json(supervisor)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  // Update Supervisor by ID
  static async updateSupervisor(req: Request, res: Response): Promise<void> {
    try {
      const supervisor = await SupervisorService.updateSupervisor(
        req.params.id,
        req.body,
      )
      if (!supervisor) {
        res.status(404).json({ message: 'Supervisor not found' })
        return
      }
      res.status(200).json(supervisor)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  // Delete Supervisor by ID
  static async deleteSupervisor(req: Request, res: Response): Promise<void> {
    try {
      const supervisor = await SupervisorService.deleteSupervisor(req.params.id)
      if (!supervisor) {
        res.status(404).json({ message: 'Supervisor not found' })
        return
      }
      res.status(200).json({ message: 'Supervisor deleted successfully' })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}

export default SupervisorController
