import { Model } from "mongoose";
import Pet from "../pets.model";
import { CreatePetDTO, UpdatePetDTO } from "../dto/pet.dto";
import { IPet } from "../pets.model";

export class PetsDAO {
  constructor(private readonly model: Model<IPet>) {}

  async create(petData: CreatePetDTO) {
    const pet = new this.model(petData);
    return await pet.save();
  }

  async findAll() {
    return await this.model.find().exec();
  }

  async findById(id: string) {
    return await this.model.findById(id).exec();
  }

  async update(id: string, petData: UpdatePetDTO) {
    return await this.model
      .findByIdAndUpdate(id, petData, { new: true })
      .exec();
  }

  async delete(id: string) {
    return await this.model.findByIdAndDelete(id).exec();
  }
}

export const petsDAO = new PetsDAO(Pet);
