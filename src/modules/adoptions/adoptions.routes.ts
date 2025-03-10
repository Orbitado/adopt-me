import { Router } from "express";
import { adoptionsController } from "./adoptions.controller";

/**
 * Router for the adoptions module
 * All routes are under /api/adoptions
 */
const router = Router();

/**
 * @route   POST /api/adoptions
 * @desc    Create a new adoption
 * @access  Public
 * @body    { petId: string, userId: string, status?: string, adoptionDate?: Date }
 * @returns { success: boolean, message: string, payload: Adoption }
 */
router.post("/", adoptionsController.createAdoption.bind(adoptionsController));

/**
 * @route   GET /api/adoptions
 * @desc    Get all adoptions
 * @access  Public
 * @returns { success: boolean, message: string, payload: Adoption[] }
 */
router.get("/", adoptionsController.getAllAdoptions.bind(adoptionsController));

/**
 * @route   GET /api/adoptions/:id
 * @desc    Get an adoption by its ID
 * @access  Public
 * @param   id - ID of the adoption
 * @returns { success: boolean, message: string, payload: Adoption }
 */
router.get(
  "/:id",
  adoptionsController.getAdoptionById.bind(adoptionsController),
);

/**
 * @route   PUT /api/adoptions/:id
 * @desc    Update an adoption by its ID
 * @access  Public
 * @param   id - ID of the adoption
 * @body    { status?: string, adoptionDate?: Date }
 * @returns { success: boolean, message: string, payload: Adoption }
 */
router.put(
  "/:id",
  adoptionsController.updateAdoption.bind(adoptionsController),
);

/**
 * @route   DELETE /api/adoptions/:id
 * @desc    Delete an adoption by its ID
 * @access  Public
 * @param   id - ID of the adoption
 * @returns { success: boolean, message: string, payload: Adoption }
 */
router.delete(
  "/:id",
  adoptionsController.deleteAdoption.bind(adoptionsController),
);

export default router;
