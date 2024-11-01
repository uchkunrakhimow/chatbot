import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { User } from '../../models/user.model'
import { IUser } from './../../types/models'

class UserService {
  /**
   * Create a new user with hashed password.
   * @param userData - User data to be saved
   */
  static async createUser(userData: IUser): Promise<IUser> {
    // Hash the password only if it's provided
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10)
    }

    const newUser = new User(userData)
    return await newUser.save()
  }

  /**
   * Validate user credentials by comparing passwords.
   * @param username - Username of the user
   * @param password - Password provided by the user
   */
  static async validateUserCredentials(username: string, password: string) {
    const user = await User.findOne({ username }).lean()
    if (!user) return null

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    return isPasswordValid ? user : null
  }

  /**
   * Validate if the provided role is allowed.
   * @param role - Role to validate
   * @param allowedRoles - List of allowed roles
   */
  static isValidRole(role: string, allowedRoles: string[]): boolean {
    return allowedRoles.includes(role)
  }

  /**
   * Get all users.
   */
  static async getAllUsers() {
    await User.find().lean().sort({ createdAt: -1 })
  }

  /**
   * Get user by ID.
   * @param userId - ID of the user to fetch
   */
  static async getUserById(userId: string) {
    await User.findById(userId).lean()
  }

  /**
   * Get user by username.
   * @param username - Username to search for
   */
  static async getUserByUsername(username: string) {
    return await User.findOne({ username }).lean()
  }

  /**
   * Get a paginated list of users based on a filter.
   * @param filter - Filter conditions
   * @param page - Page number for pagination
   * @param limit - Limit of users per page
   */
  static async getUsers(
    filter: Record<string, any>,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit

    await User.find(filter)
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'assistants',
        select: '-password',
      })
      .sort({ createdAt: -1 })
      .select('-password')
      .lean()
  }

  /**
   * Get the count of users based on a filter.
   * @param filter - Filter conditions
   */
  static async getUserCount(filter: Record<string, any>): Promise<number> {
    return await User.countDocuments(filter)
  }

  /**
   * Update a user by ID.
   * @param userId - ID of the user to update
   * @param userData - New user data
   */
  static async updateUser(userId: string, userData: Partial<IUser>) {
    // Hash the password only if it's provided
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10)
    }

    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(userId, userData, {
      new: true, // Return the updated document
      lean: true, // Return plain JavaScript object instead of Mongoose document
    })

    if (!updatedUser) throw new Error('User not found')

    return updatedUser
  }

  /**
   * Delete a user by ID.
   * @param userId - ID of the user to delete
   */
  static async deleteUser(userId: string) {
    const deletedUser = await User.findByIdAndDelete(userId).lean()
    if (!deletedUser) throw new Error('User not found')
    return deletedUser
  }

  /**
   * Validate if the provided string is a valid MongoDB ObjectId.
   * @param id - ID to validate
   */
  static isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id)
  }
}

export default UserService
