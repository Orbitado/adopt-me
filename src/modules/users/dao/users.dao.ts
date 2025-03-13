import { Model } from "mongoose";
import User from "../users.model";
import { IUser } from "../users.model";

export class UsersDAO {
  constructor(private readonly model: Model<IUser>) {}

  async create(userData: Partial<IUser>) {
    const user = new this.model(userData);
    return await user.save();
  }

  async findAll() {
    return await this.model.find().exec();
  }

  async findById(id: string) {
    return await this.model.findById(id).exec();
  }

  async findByEmail(email: string) {
    return await this.model.findOne({ email }).exec();
  }

  async update(id: string, userData: Partial<IUser>) {
    return await this.model
      .findByIdAndUpdate(id, userData, { new: true })
      .exec();
  }

  async delete(id: string) {
    return await this.model.findByIdAndDelete(id).exec();
  }

  // Method to insert many users at once (for mocking)
  async insertMany(users: Partial<IUser>[]) {
    return await this.model.insertMany(users);
  }
}

export const usersDAO = new UsersDAO(User);
