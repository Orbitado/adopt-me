import { Request, Response, NextFunction } from "express";
import { petsService } from "./pets.service";
import { CustomError } from "../../types/types";
import { errorHandler } from "../../middlewares/error-handler";
import { ErrorDictionary } from "../../utils/error-dictionary";

export class PetsController {
  async createPet(req: Request, res: Response, next: NextFunction) {
    try {
      const existingPet = await petsService.getPetByName(req.body.name);

      if (existingPet) {
        throw ErrorDictionary.resourceExists("Pet");
      } else {
        const petData = req.body;
        const pet = await petsService.createPet(petData);
        res.status(201).json({
          success: true,
          message: `Pet ${pet.name} created successfully`,
          payload: pet,
        });
      }
    } catch (error) {
      errorHandler(error as CustomError, req, res, next);
    }
  }

  async getAllPets(req: Request, res: Response, next: NextFunction) {
    try {
      const pets = await petsService.getAllPets();
      res.status(200).json({
        success: true,
        message: "Pets fetched successfully",
        payload: pets,
      });
    } catch (error) {
      errorHandler(error as CustomError, req, res, next);
    }
  }

  async getPetById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw ErrorDictionary.invalidRequest("Pet ID is required");
      }

      const pet = await petsService.getPetById(id);

      if (!pet) {
        throw ErrorDictionary.resourceNotFound("Pet", id);
      }

      res.status(200).json({
        success: true,
        message: `Pet ${pet.name} fetched successfully`,
        payload: pet,
      });
    } catch (error) {
      errorHandler(error as CustomError, req, res, next);
    }
  }

  async updatePet(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const petData = req.body;

      if (!id) {
        throw ErrorDictionary.invalidRequest("Pet ID is required");
      }

      const pet = await petsService.updatePet(id, petData);

      if (!pet) {
        throw ErrorDictionary.resourceNotFound("Pet", id);
      }

      res.status(200).json({
        success: true,
        message: `Pet ${pet.name} updated successfully`,
        payload: pet,
      });
    } catch (error) {
      errorHandler(error as CustomError, req, res, next);
    }
  }

  async deletePet(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw ErrorDictionary.invalidRequest("Pet ID is required");
      }

      const pet = await petsService.deletePet(id);

      if (!pet) {
        const details = {
          message: `Pet not found with id: ${id}`,
        };
        throw ErrorDictionary.resourceNotFound("Pet", id, details);
      }

      res.status(200).json({
        success: true,
        message: `Pet ${pet.name} deleted successfully`,
        payload: pet,
      });
    } catch (error) {
      errorHandler(error as CustomError, req, res, next);
    }
  }
}

export const petsController = new PetsController();
