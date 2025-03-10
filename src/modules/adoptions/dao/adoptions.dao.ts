import { Model } from "mongoose";
import Adoption from "../adoptions.model";
import { CreateAdoptionDTO, UpdateAdoptionDTO } from "../dto/adoption.dto";
import { IAdoption } from "../adoptions.model";
import { MongoServerError, CastError } from "../../../types/types";

export class AdoptionsDAO {
  constructor(private readonly model: Model<IAdoption>) {}

  async create(adoptionData: CreateAdoptionDTO) {
    try {
      const adoption = new this.model(adoptionData);
      return await adoption.save();
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
    return await this.model.find().exec();
  }

  async findById(id: string) {
    try {
      return await this.model.findById(id).exec();
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

  async findByUserId(userId: string) {
    return await this.model.find({ userId }).exec();
  }

  async update(id: string, adoptionData: UpdateAdoptionDTO) {
    try {
      return await this.model
        .findByIdAndUpdate(id, adoptionData, { new: true })
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
      return await this.model.findByIdAndDelete(id).exec();
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

export const adoptionsDAO = new AdoptionsDAO(Adoption);
