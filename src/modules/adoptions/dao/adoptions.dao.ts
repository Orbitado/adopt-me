import { Model } from "mongoose";
import Adoption from "../adoptions.model";
import { CreateAdoptionDTO, UpdateAdoptionDTO } from "../dto/adoption.dto";
import { IAdoption } from "../adoptions.model";
import { MongoServerError, CastError } from "../../../types/types";

export class AdoptionsDAO {
  constructor(private readonly model: Model<IAdoption>) {}

  /**
   * Create a new adoption in the database
   * @param adoptionData Data of the adoption to create
   * @returns The created adoption
   */
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

  /**
   * Get all adoptions
   * @returns List of adoptions
   */
  async findAll() {
    return await this.model.find().exec();
  }

  /**
   * Get an adoption by its ID
   * @param id ID of the adoption
   * @returns The found adoption or null if it doesn't exist
   */
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

  /**
   * Get adoptions by user ID
   * @param userId ID of the user
   * @returns List of adoptions of the user
   */
  async findByUserId(userId: string) {
    return await this.model.find({ userId }).exec();
  }

  /**
   * Actualiza una adopción
   * @param id ID of the adoption to update
   * @param adoptionData Data to update
   * @returns The updated adoption or null if it doesn't exist
   */
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

  /**
   * Delete an adoption
   * @param id ID of the adoption to delete
   * @returns The deleted adoption or null if it doesn't exist
   */
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
