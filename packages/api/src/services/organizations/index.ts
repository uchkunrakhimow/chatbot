import { Organization } from '../../models/organization.model'
import { IOrganization } from '../../types/models'

class OrganizationService {
  // Create a new organization
  static async createOrganization(data: IOrganization): Promise<IOrganization> {
    const organization = new Organization(data)
    return await organization.save()
  }

  // Get all organizations
  static async getAllOrganizations(): Promise<IOrganization[]> {
    return await Organization.find().populate('supervisors')
  }

  // Get an organization by ID
  static async getOrganizationById(id: string): Promise<IOrganization | null> {
    return await Organization.findById(id).populate('supervisors')
  }

  // Update an organization by ID
  static async updateOrganization(
    id: string,
    data: Partial<IOrganization>,
  ): Promise<IOrganization | null> {
    return await Organization.findByIdAndUpdate(id, data, { new: true })
  }

  // Delete an organization by ID
  static async deleteOrganization(id: string): Promise<IOrganization | null> {
    return await Organization.findByIdAndDelete(id)
  }
}

export default OrganizationService
