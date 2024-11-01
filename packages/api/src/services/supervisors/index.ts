import { Supervisor } from '../../models/supervisor.model'
import { ISupervisor } from '../../types/models'

class SupervisorService {
  // Create a new supervisor
  static async createSupervisor(data: ISupervisor): Promise<ISupervisor> {
    const supervisor = new Supervisor(data)
    return await supervisor.save()
  }

  // Get all supervisors
  static async getAllSupervisors(): Promise<ISupervisor[]> {
    return await Supervisor.find().populate('organization users')
  }

  // Get a supervisor by ID
  static async getSupervisorById(id: string): Promise<ISupervisor | null> {
    return await Supervisor.findById(id).populate('organization users')
  }

  // Update a supervisor by ID
  static async updateSupervisor(
    id: string,
    data: Partial<ISupervisor>,
  ): Promise<ISupervisor | null> {
    return await Supervisor.findByIdAndUpdate(id, data, { new: true })
  }

  // Delete a supervisor by ID
  static async deleteSupervisor(id: string): Promise<ISupervisor | null> {
    return await Supervisor.findByIdAndDelete(id)
  }
}

export default SupervisorService
