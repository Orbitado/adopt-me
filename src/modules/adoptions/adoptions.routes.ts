import { Router } from "express";
import { adoptionsController } from "./adoptions.controller";

const router = Router();

/**
 * @route   POST /api/adoptions
 * @desc    Create a new adoption
 * @access  Public
 */
router.post("/", adoptionsController.createAdoption.bind(adoptionsController));

/**
 * @route   GET /api/adoptions
 * @desc    Get all adoptions
 * @access  Public
 */
router.get("/", adoptionsController.getAllAdoptions.bind(adoptionsController));

/**
 * @route   GET /api/adoptions/:id
 * @desc    Get a adoption by ID
 * @access  Public
 */
router.get(
  "/:id",
  adoptionsController.getAdoptionById.bind(adoptionsController),
);

/**
 * @route   PUT /api/adoptions/:id
 * @desc    Update a adoption by ID
 * @access  Public
 */
router.put(
  "/:id",
  adoptionsController.updateAdoption.bind(adoptionsController),
);

/**
 * @route   DELETE /api/adoptions/:id
 * @desc    Delete a adoption by ID
 * @access  Public
 */
router.delete(
  "/:id",
  adoptionsController.deleteAdoption.bind(adoptionsController),
);

export default router;
