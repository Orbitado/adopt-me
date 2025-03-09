import { Request, Response, NextFunction } from "express";
import { adoptionsService } from "./adoptions.service";
import { CustomError } from "../../types/types";
import { errorHandler } from "../../middlewares/error-handler";
import { ErrorDictionary } from "../../utils/error-dictionary";
import { petsService } from "../pets/pets.service";
import { IPet } from "../pets/pets.model";
import { IUser } from "../users/users.model";
import { usersService } from "../users/users.service";
export class AdoptionsController {
  async createAdoption(req: Request, res: Response, next: NextFunction) {
    try {
      const { petId, userId } = req.body;

      if (!petId || !userId) {
        throw ErrorDictionary.invalidRequest("Pet ID and User ID are required");
      }

      const user = await usersService.getUserById(userId);
      if (!user) {
        throw ErrorDictionary.resourceNotFound("User", userId);
      }

      const pet: IPet | null = await petsService.getPetById(petId);
      if (!pet) {
        throw ErrorDictionary.resourceNotFound("Pet", petId);
      }

      if (pet.isAdopted) {
        throw ErrorDictionary.invalidRequest("Pet is already adopted");
      }

      try {
        const adoptionData = req.body;
        const adoption = await adoptionsService.createAdoption(adoptionData);

        const updatedPet: IPet | null = await petsService.updatePet(petId, {
          isAdopted: true,
        });

        const updatedUser: IUser | null = await usersService.updateUser(
          userId,
          {
            pets: [...user.pets, petId],
          },
        );

        res.status(201).json({
          success: true,
          message: `Adoption ${adoption.id} created successfully`,
          payload: { adoption, pet: updatedPet, user: updatedUser },
        });
      } catch (error) {
        throw ErrorDictionary.internalServerError(
          "Failed to complete adoption process",
          (error as Error).message,
        );
      }
    } catch (error) {
      errorHandler(error as CustomError, req, res, next);
    }
  }

  async getAllAdoptions(req: Request, res: Response, next: NextFunction) {
    try {
      const adoptions = await adoptionsService.getAllAdoptions();
      res.status(200).json({
        success: true,
        message: "Adoptions fetched successfully",
        payload: adoptions,
      });
    } catch (error) {
      errorHandler(error as CustomError, req, res, next);
    }
  }

  async getAdoptionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw ErrorDictionary.invalidRequest("Adoption ID is required");
      }

      const adoption = await adoptionsService.getAdoptionById(id);
      if (!adoption) {
        throw ErrorDictionary.resourceNotFound("Adoption", id);
      }

      res.status(200).json({
        success: true,
        message: `Adoption ${id} fetched successfully`,
        payload: adoption,
      });
    } catch (error) {
      errorHandler(error as CustomError, req, res, next);
    }
  }

  async updateAdoption(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const adoptionData = req.body;

      if (!id) {
        throw ErrorDictionary.invalidRequest("Adoption ID is required");
      }

      const updatedAdoption = await adoptionsService.updateAdoption(
        id,
        adoptionData,
      );
      res.status(200).json({
        success: true,
        message: `Adoption ${id} updated successfully`,
        payload: updatedAdoption,
      });
    } catch (error) {
      errorHandler(error as CustomError, req, res, next);
    }
  }

  async deleteAdoption(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw ErrorDictionary.invalidRequest("Adoption ID is required");
      }

      const deletedAdoption = await adoptionsService.deleteAdoption(id);
      res.status(200).json({
        success: true,
        message: `Adoption ${id} deleted successfully`,
        payload: deletedAdoption,
      });
    } catch (error) {
      errorHandler(error as CustomError, req, res, next);
    }
  }
}

export const adoptionsController = new AdoptionsController();
