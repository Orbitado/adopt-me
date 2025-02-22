import { Model } from "mongoose";
import Adoption from "@/modules/adoptions/adoptions-model";
import {
  CreateAdoptionDTO,
  UpdateAdoptionDTO,
} from "@/modules/adoptions/dto/adoption.dto";
import { IAdoption } from "@/modules/adoptions/adoptions-model";

export class AdoptionsDAO {
  constructor(private readonly model: Model<IAdoption>) {}

  async create(adoptionData: CreateAdoptionDTO) {
    const adoption = new this.model(adoptionData);
    return await adoption.save();
  }

  async findAll() {
    return await this.model.find().populate("petId").populate("userId").exec();
  }

  async findById(id: string) {
    return await this.model
      .findById(id)
      .populate("petId")
      .populate("userId")
      .exec();
  }

  async findByUserId(userId: string) {
    return await this.model
      .find({ userId })
      .populate("petId")
      .populate("userId")
      .exec();
  }

  async update(id: string, adoptionData: UpdateAdoptionDTO) {
    return await this.model
      .findByIdAndUpdate(id, adoptionData, { new: true })
      .populate("petId")
      .populate("userId")
      .exec();
  }

  async delete(id: string) {
    return await this.model.findByIdAndDelete(id).exec();
  }
}

export const adoptionsDAO = new AdoptionsDAO(Adoption);
