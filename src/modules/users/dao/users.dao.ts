import { Model } from "mongoose";
import User from "../users.model";
import { CreateUserDTO, UpdateUserDTO } from "../dto/user.dto";
import { IUser } from "../users.model";

export class UsersDAO {
  constructor(private readonly model: Model<IUser>) {}

  async create(userData: CreateUserDTO) {
    const user = new this.model(userData);
    return await user.save();
  }

  async findAll() {
    return await this.model
      .find({}, "first_name last_name email role")
      .limit(100)
      .lean()
      .exec();
  }

  async findById(id: string) {
    return await this.model.findById(id).populate("pets").lean().exec();
  }

  async findByEmail(email: string) {
    return await this.model.findOne({ email }).lean().exec();
  }

  async update(id: string, userData: UpdateUserDTO) {
    return await this.model
      .findByIdAndUpdate(id, userData, { new: true })
      .populate("pets")
      .lean()
      .exec();
  }

  async delete(id: string) {
    return await this.model.findByIdAndDelete(id).lean().exec();
  }
}

export const usersDAO = new UsersDAO(User);
