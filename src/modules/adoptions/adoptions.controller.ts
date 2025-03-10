import { Request, Response, NextFunction } from "express";
import { adoptionsService } from "./adoptions.service";
import { CustomError } from "../../types/types";
import { errorHandler } from "../../middlewares/error-handler";
import { ErrorDictionary } from "../../utils/error-dictionary";

export class AdoptionsController {
  /**
   * Create a new adoption
   * POST /api/adoptions
   */
  async createAdoption(req: Request, res: Response, next: NextFunction) {
    try {
      const adoptionData = req.body;
      const adoption = await adoptionsService.createAdoption(adoptionData);

      res.status(201).json({
        success: true,
        message: `Adoption created successfully`,
        payload: adoption,
      });
    } catch (error) {
      errorHandler(error as CustomError, req, res, next);
    }
  }

  /**
   * Get all adoptions
   * GET /api/adoptions
   */
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

  /**
   * Get an adoption by its ID
   * GET /api/adoptions/:id
   */
  async getAdoptionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // TODO: Move this to a middleware
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

  /**
   * Update an adoption
   * PUT /api/adoptions/:id
   */
  async updateAdoption(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const adoptionData = req.body;

      // TODO: Move this to a middleware
      if (!id) {
        throw ErrorDictionary.invalidRequest("Adoption ID is required");
      }

      const updatedAdoption = await adoptionsService.updateAdoption(
        id,
        adoptionData,
      );

      // TODO: Move this to a middleware
      if (!updatedAdoption) {
        throw ErrorDictionary.resourceNotFound("Adoption", id);
      }

      res.status(200).json({
        success: true,
        message: `Adoption ${id} updated successfully`,
        payload: updatedAdoption,
      });
    } catch (error) {
      errorHandler(error as CustomError, req, res, next);
    }
  }

  /**
   * Delete an adoption
   * DELETE /api/adoptions/:id
   */
  async deleteAdoption(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // TODO: Move this to a middleware
      if (!id) {
        throw ErrorDictionary.invalidRequest("Adoption ID is required");
      }

      const deletedAdoption = await adoptionsService.deleteAdoption(id);

      // TODO: Move this to a middleware
      if (!deletedAdoption) {
        throw ErrorDictionary.resourceNotFound("Adoption", id);
      }

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
