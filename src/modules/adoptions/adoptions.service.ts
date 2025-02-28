import { adoptionsDAO } from "./dao/adoptions.dao";
import { CreateAdoptionDTO, UpdateAdoptionDTO } from "./dto/adoption.dto";

export class AdoptionsService {
  async createAdoption(adoptionData: CreateAdoptionDTO) {
    return await adoptionsDAO.create(adoptionData);
  }

  async getAllAdoptions() {
    return await adoptionsDAO.findAll();
  }

  async getAdoptionById(id: string) {
    return await adoptionsDAO.findById(id);
  }

  async getAdoptionsByUserId(userId: string) {
    return await adoptionsDAO.findByUserId(userId);
  }

  async updateAdoption(id: string, adoptionData: UpdateAdoptionDTO) {
    return await adoptionsDAO.update(id, adoptionData);
  }

  async deleteAdoption(id: string) {
    return await adoptionsDAO.delete(id);
  }
}

export const adoptionsService = new AdoptionsService();
