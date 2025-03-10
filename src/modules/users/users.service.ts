import { usersDAO } from "./dao/users.dao";
import { CreateUserDTO, UpdateUserDTO } from "./dto/user.dto";
import { ErrorDictionary } from "../../utils/error-dictionary";
import { IUser } from "./users.model";

export class UsersService {
  async createUser(userData: CreateUserDTO) {
    const existingUser: IUser | null = await this.getUserByEmail(
      userData.email,
    );
    if (existingUser) {
      throw ErrorDictionary.resourceExists("User");
    }

    return await usersDAO.create(userData);
  }

  async getAllUsers() {
    return await usersDAO.findAll();
  }

  async getUserById(id: string) {
    if (!id) {
      throw ErrorDictionary.invalidRequest("User ID is required");
    }

    const user: IUser | null = await usersDAO.findById(id);

    return user;
  }

  async getUserByEmail(email: string) {
    if (!email) {
      throw ErrorDictionary.invalidRequest("User email is required");
    }

    return await usersDAO.findByEmail(email);
  }

  async updateUser(id: string, userData: UpdateUserDTO) {
    if (!id) {
      throw ErrorDictionary.invalidRequest("User ID is required");
    }

    if (Object.keys(userData).length === 0) {
      throw ErrorDictionary.invalidRequest("No update data provided");
    }

    const existingUser = await this.getUserById(id);
    if (!existingUser) {
      return null;
    }

    if (userData.email && userData.email !== existingUser.email) {
      const userWithEmail: IUser | null = await this.getUserByEmail(
        userData.email,
      );
      if (userWithEmail) {
        throw ErrorDictionary.resourceExists(
          "User with this email already exists",
        );
      }
    }

    return await usersDAO.update(id, userData);
  }

  async deleteUser(id: string) {
    if (!id) {
      throw ErrorDictionary.invalidRequest("User ID is required");
    }

    const existingUser: IUser | null = await this.getUserById(id);
    if (!existingUser) {
      return null;
    }

    return await usersDAO.delete(id);
  }
}

export const usersService = new UsersService();
