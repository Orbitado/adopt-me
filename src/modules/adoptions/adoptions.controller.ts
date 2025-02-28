import { Request, Response, NextFunction } from "express";
import { adoptionsService } from "./adoptions.service";
import { CustomError } from "../../types/types";
import { errorHandler } from "../../middlewares/error-handler";

export class AdoptionsController {
  async createAdoption(req: Request, res: Response, next: NextFunction) {
    try {
      const adoptionData = req.body;
      const adoption = await adoptionsService.createAdoption(adoptionData);
      res.status(201).json({
        success: true,
        message: `Adoption ${adoption.id} created successfully`,
        payload: adoption,
      });
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
        const error: CustomError = new Error("Adoption ID is required");
        error.status = 400;
        error.code = "INVALID_REQUEST";
        throw error;
      }

      const adoption = await adoptionsService.getAdoptionById(id);
      if (!adoption) {
        const error: CustomError = new Error("Adoption not found");
        error.status = 404;
        error.code = "NOT_FOUND";
        throw error;
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
        const error: CustomError = new Error("Adoption ID is required");
        error.status = 400;
        error.code = "INVALID_REQUEST";
        throw error;
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
        const error: CustomError = new Error("Adoption ID is required");
        error.status = 400;
        error.code = "INVALID_REQUEST";
        throw error;
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
