import { usersDAO } from "./dao/users.dao";
import { CreateUserDTO, UpdateUserDTO } from "./dto/user.dto";

export class UsersService {
  async createUser(userData: CreateUserDTO) {
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

  async updateUser(id: string, userData: UpdateUserDTO) {
    return await usersDAO.update(id, userData);
  }

  async deleteUser(id: string) {
    return await usersDAO.delete(id);
  }
}

export const usersService = new UsersService();
