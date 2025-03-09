import { Router } from "express";
import { usersController } from "./users.controller";

const router = Router();

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Public
 */
router.post("/", usersController.createUser.bind(usersController));

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Public
 */
router.get("/", usersController.getAllUsers.bind(usersController));

/**
 * @route   GET /api/users/:id
 * @desc    Get a user by ID
 * @access  Public
 */
router.get("/:id", usersController.getUserById.bind(usersController));

/**
 * @route   PUT /api/users/:id
 * @desc    Update a user by ID
 * @access  Public
 */
router.put("/:id", usersController.updateUser.bind(usersController));

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user by ID
 * @access  Public
 */
router.delete("/:id", usersController.deleteUser.bind(usersController));

export default router;
