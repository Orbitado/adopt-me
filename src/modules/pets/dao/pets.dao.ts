import { Model } from "mongoose";
import Pet from "../pets.model";
import { CreatePetDTO, UpdatePetDTO } from "../dto/pet.dto";
import { IPet } from "../pets.model";
import { MongoServerError, CastError } from "../../../types/types";

export class PetsDAO {
  constructor(private readonly model: Model<IPet>) {}

  async create(petData: CreatePetDTO) {
    try {
      const pet = new this.model(petData);
      return await pet.save();
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
      .find({}, "name breed gender size isAdopted")
      .limit(100)
      .lean()
      .exec();
  }

  async findById(id: string) {
    try {
      return await this.model.findById(id).lean().exec();
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

  async findByName(name: string) {
    return await this.model.findOne({ name }).lean().exec();
  }

  async update(id: string, petData: UpdatePetDTO) {
    try {
      return await this.model
        .findByIdAndUpdate(id, petData, { new: true })
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

export const petsDAO = new PetsDAO(Pet);
