import { Request, Response, NextFunction } from "express";
import { petsService } from "./pets.service";

export class PetsController {
  async createPet(req: Request, res: Response, next: NextFunction) {
    try {
      const petData = req.body;
      const pet = await petsService.createPet(petData);

      res.status(201).json({
        success: true,
        message: `Pet ${pet.name} created successfully`,
        payload: pet,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllPets(_req: Request, res: Response, next: NextFunction) {
    try {
      const pets = await petsService.getAllPets();

      res.status(200).json({
        success: true,
        message: "Pets fetched successfully",
        payload: pets,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPetById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params["id"] || "";
      const pet = await petsService.getPetById(id);

      res.status(200).json({
        success: true,
        message: `Pet ${pet!.name} fetched successfully`,
        payload: pet,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPetByName(req: Request, res: Response, next: NextFunction) {
    try {
      const name = req.params["name"] || "";
      const pet = await petsService.getPetByName(name);

      res.status(200).json({
        success: true,
        message: `Pet ${pet!.name} fetched successfully`,
        payload: pet,
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePet(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params["id"] || "";
      const petData = req.body;

      const pet = await petsService.updatePet(id, petData);

      res.status(200).json({
        success: true,
        message: `Pet ${pet!.name} updated successfully`,
        payload: pet,
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePet(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params["id"] || "";

      const pet = await petsService.deletePet(id);

      res.status(200).json({
        success: true,
        message: `Pet ${pet!.name} deleted successfully`,
        payload: pet,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const petsController = new PetsController();
