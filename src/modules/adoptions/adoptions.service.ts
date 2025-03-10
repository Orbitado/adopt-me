import { adoptionsDAO } from "./dao/adoptions.dao";
import { CreateAdoptionDTO, UpdateAdoptionDTO } from "./dto/adoption.dto";
import { ErrorDictionary } from "../../utils/error-dictionary";
import { petsService } from "../pets/pets.service";
import { usersService } from "../users/users.service";

export class AdoptionsService {
  async createAdoption(adoptionData: CreateAdoptionDTO) {
    const { petId, userId } = adoptionData;

    if (!petId || !userId) {
      throw ErrorDictionary.invalidRequest("Pet ID and User ID are required");
    }

    const user = await usersService.getUserById(userId);
    if (!user) {
      throw ErrorDictionary.resourceNotFound("User", userId);
    }

    const pet = await petsService.getPetById(petId);
    if (!pet) {
      throw ErrorDictionary.resourceNotFound("Pet", petId);
    }

    if (pet.isAdopted) {
      throw ErrorDictionary.invalidRequest("Pet is already adopted");
    }

    try {
      const adoption = await adoptionsDAO.create(adoptionData);

      await petsService.updatePet(petId, {
        isAdopted: true,
      });

      await usersService.updateUser(userId, {
        pets: [
          {
            _id: petId,
            description: pet.description,
            name: pet.name,
            size: pet.size as "small" | "medium" | "large",
            breed: pet.breed,
            gender: pet.gender as "male" | "female",
            birthDate: pet.birthDate,
          },
        ],
      });

      return adoption;
    } catch (error) {
      throw ErrorDictionary.internalServerError(
        "Failed to complete adoption process",
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async getAllAdoptions() {
    return await adoptionsDAO.findAll();
  }

  async getAdoptionById(id: string) {
    if (!id) {
      throw ErrorDictionary.invalidRequest("Adoption ID is required");
    }

    const adoption = await adoptionsDAO.findById(id);

    return adoption;
  }

  async getAdoptionsByUserId(userId: string) {
    if (!userId) {
      throw ErrorDictionary.invalidRequest("User ID is required");
    }

    return await adoptionsDAO.findByUserId(userId);
  }

  async updateAdoption(id: string, adoptionData: UpdateAdoptionDTO) {
    if (!id) {
      throw ErrorDictionary.invalidRequest("Adoption ID is required");
    }

    if (Object.keys(adoptionData).length === 0) {
      throw ErrorDictionary.invalidRequest("No update data provided");
    }

    const existingAdoption = await this.getAdoptionById(id);
    if (!existingAdoption) {
      return null;
    }

    return await adoptionsDAO.update(id, adoptionData);
  }

  async deleteAdoption(id: string) {
    if (!id) {
      throw ErrorDictionary.invalidRequest("Adoption ID is required");
    }

    const existingAdoption = await this.getAdoptionById(id);
    if (!existingAdoption) {
      return null;
    }

    const { petId, userId } = existingAdoption;

    if (!petId) {
      throw ErrorDictionary.invalidRequest("Pet ID is required");
    }

    if (!userId) {
      throw ErrorDictionary.invalidRequest("User ID is required");
    }

    await petsService.updatePet(petId, {
      isAdopted: false,
    });

    await usersService.updateUser(userId, {
      pets: [],
    });

    await adoptionsDAO.delete(id);

    return {
      _id: existingAdoption._id,
      petId,
      userId,
      status: existingAdoption.status,
      adoptionDate: existingAdoption.adoptionDate,
    };
  }
}

export const adoptionsService = new AdoptionsService();
