import { Model } from "mongoose";
import User from "../users.model";
import { CreateUserDTO, UpdateUserDTO } from "../dto/user.dto";
import { IUser } from "../users.model";

interface MongoServerError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

interface CastError extends Error {
  kind?: string;
}

export class UsersDAO {
  constructor(private readonly model: Model<IUser>) {}

  async create(userData: CreateUserDTO) {
    try {
      const user = new this.model(userData);
      return await user.save();
    } catch (error) {
      if (
        error instanceof Error &&
        (error as MongoServerError).code === 11000
      ) {
        const mongoError = error as MongoServerError;
        throw new Error(
          `Duplicate key error: ${JSON.stringify(mongoError.keyValue)}`,
        );
      }
      throw error;
    }
  }

  async findAll() {
    return await this.model
      .find({}, "first_name last_name email role")
      .limit(100)
      .lean()
      .exec();
  }

  async findById(id: string) {
    try {
      return await this.model.findById(id).populate("pets").lean().exec();
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "CastError" &&
        (error as CastError).kind === "ObjectId"
      ) {
        return null;
      }
      throw error;
    }
  }

  async findByEmail(email: string) {
    return await this.model.findOne({ email }).lean().exec();
  }

  async update(id: string, userData: UpdateUserDTO) {
    try {
      return await this.model
        .findByIdAndUpdate(id, userData, { new: true })
        .populate("pets")
        .lean()
        .exec();
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "CastError" &&
        (error as CastError).kind === "ObjectId"
      ) {
        return null;
      }
      throw error;
    }
  }

  async delete(id: string) {
    try {
      return await this.model.findByIdAndDelete(id).lean().exec();
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "CastError" &&
        (error as CastError).kind === "ObjectId"
      ) {
        return null;
      }
      throw error;
    }
  }
}

export const usersDAO = new UsersDAO(User);
