import { petsDAO } from "./dao/pets.dao";
import { CreatePetDTO, UpdatePetDTO } from "./dto/pet.dto";

export class PetsService {
  async createPet(petData: CreatePetDTO) {
    return await petsDAO.create(petData);
  }

  async getAllPets() {
    return await petsDAO.findAll();
  }

  async getPetById(id: string) {
    return await petsDAO.findById(id);
  }

  async getPetByName(name: string) {
    return await petsDAO.findByName(name);
  }

  async updatePet(id: string, petData: UpdatePetDTO) {
    return await petsDAO.update(id, petData);
  }

  async deletePet(id: string) {
    return await petsDAO.delete(id);
  }
}

export const petsService = new PetsService();
