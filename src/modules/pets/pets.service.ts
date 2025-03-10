import { petsDAO } from "./dao/pets.dao";
import { CreatePetDTO, UpdatePetDTO } from "./dto/pet.dto";
import { ErrorDictionary } from "../../utils/error-dictionary";

export class PetsService {
  async createPet(petData: CreatePetDTO) {
    const existingPet = await this.getPetByName(petData.name);
    if (existingPet) {
      throw ErrorDictionary.resourceExists("Pet");
    }

    return await petsDAO.create(petData);
  }

  async getAllPets() {
    return await petsDAO.findAll();
  }

  async getPetById(id: string) {
    if (!id) {
      throw ErrorDictionary.invalidRequest("Pet ID is required");
    }

    const pet = await petsDAO.findById(id);

    return pet;
  }

  async getPetByName(name: string) {
    if (!name) {
      throw ErrorDictionary.invalidRequest("Pet name is required");
    }

    return await petsDAO.findByName(name);
  }

  async updatePet(id: string, petData: UpdatePetDTO) {
    if (!id) {
      throw ErrorDictionary.invalidRequest("Pet ID is required");
    }

    if (Object.keys(petData).length === 0) {
      throw ErrorDictionary.invalidRequest("No update data provided");
    }

    const existingPet = await this.getPetById(id);
    if (!existingPet) {
      return null;
    }

    if (petData.name && petData.name !== existingPet.name) {
      const petWithName = await this.getPetByName(petData.name);
      if (petWithName) {
        throw ErrorDictionary.resourceExists(
          "Pet with this name already exists",
        );
      }
    }

    return await petsDAO.update(id, petData);
  }

  async deletePet(id: string) {
    if (!id) {
      throw ErrorDictionary.invalidRequest("Pet ID is required");
    }

    const existingPet = await this.getPetById(id);
    if (!existingPet) {
      return null;
    }

    if (existingPet.isAdopted) {
      throw ErrorDictionary.invalidRequest(
        "Cannot delete a pet that has been adopted",
      );
    }

    return await petsDAO.delete(id);
  }
}

export const petsService = new PetsService();
