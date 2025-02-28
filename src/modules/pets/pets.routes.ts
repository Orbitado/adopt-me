import { Router } from "express";
import { petsController } from "./pets.controller";

const router = Router();

/**
 * @route   POST /api/pets
 * @desc    Create a new pet
 * @access  Public
 */
router.post("/", petsController.createPet.bind(petsController));

/**
 * @route   GET /api/pets
 * @desc    Get all pets
 * @access  Public
 */
router.get("/", petsController.getAllPets.bind(petsController));

/**
 * @route   GET /api/pets/:id
 * @desc    Get a pet by ID
 * @access  Public
 */
router.get("/:id", petsController.getPetById.bind(petsController));

/**
 * @route   PUT /api/pets/:id
 * @desc    Update a pet by ID
 * @access  Public
 */
router.put("/:id", petsController.updatePet.bind(petsController));

/**
 * @route   DELETE /api/pets/:id
 * @desc    Delete a pet by ID
 * @access  Public
 */
router.delete("/:id", petsController.deletePet.bind(petsController));

export default router;
