import { Router } from "express";
import { adoptionsController } from "./adoptions.controller";

const router = Router();

/**
 * @route   POST /api/pets
 * @desc    Create a new pet
 * @access  Public
 */
router.post("/", adoptionsController.createAdoption.bind(adoptionsController));

/**
 * @route   GET /api/pets
 * @desc    Get all pets
 * @access  Public
 */
router.get("/", adoptionsController.getAllAdoptions.bind(adoptionsController));

/**
 * @route   GET /api/pets/:id
 * @desc    Get a pet by ID
 * @access  Public
 */
router.get(
  "/:id",
  adoptionsController.getAdoptionById.bind(adoptionsController),
);

/**
 * @route   PUT /api/pets/:id
 * @desc    Update a pet by ID
 * @access  Public
 */
router.put(
  "/:id",
  adoptionsController.updateAdoption.bind(adoptionsController),
);

/**
 * @route   DELETE /api/pets/:id
 * @desc    Delete a pet by ID
 * @access  Public
 */
router.delete(
  "/:id",
  adoptionsController.deleteAdoption.bind(adoptionsController),
);

export default router;
