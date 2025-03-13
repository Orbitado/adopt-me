import { usersDAO } from "./dao/users.dao";
import { IUser } from "./users.model";

export class UsersService {
  async createUser(userData: Partial<IUser>) {
    return await usersDAO.create(userData);
  }

  async getAllUsers() {
    return await usersDAO.findAll();
  }

  async getUserById(id: string) {
    return await usersDAO.findById(id);
  }

  async getUserByEmail(email: string) {
    return await usersDAO.findByEmail(email);
  }

  async updateUser(id: string, userData: Partial<IUser>) {
    return await usersDAO.update(id, userData);
  }

  async deleteUser(id: string) {
    return await usersDAO.delete(id);
  }

  // Method to insert many users at once (for mocking)
  async insertManyUsers(users: Partial<IUser>[]) {
    return await usersDAO.insertMany(users);
  }
}

export const usersService = new UsersService();
