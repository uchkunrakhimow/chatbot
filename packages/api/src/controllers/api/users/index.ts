import { Request, Response } from 'express'
import { UserService } from '../../../services'
import { IUser } from '../../../types/models'

class UserController {
  // Create a user
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.createUser(req.body)
      res.status(201).json(user)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  // Get all users
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getAllUsers()
      res.status(200).json(users)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  // Get user by ID
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user: IUser | any = await UserService.getUserById(req.params.id)

      if (!user) {
        res.status(404).json({ message: 'User not found' })
      }

      res.status(200).json(user)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  // Update user by ID
  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.updateUser(req.params.id, req.body)
      if (!user) {
        res.status(404).json({ message: 'User not found' })
      }
      res.status(200).json(user)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  // Delete user by ID
  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.deleteUser(req.params.id)
      if (!user) {
        res.status(404).json({ message: 'User not found' })
      }
      res.status(200).json({ message: 'User deleted successfully' })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
}

export default UserController
