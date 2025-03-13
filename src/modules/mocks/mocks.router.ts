import { Router, Request, Response, NextFunction } from "express";
import { generateMockPets, generateMockUsers } from "../../utils/mocks.utils";
import { petsService } from "../pets/pets.service";
import { usersService } from "../users/users.service";
import { CustomError } from "../../types/types";
import { errorHandler } from "../../middlewares/error-handler";
import { IPet } from "../pets/pets.model";
import { IUser } from "../users/users.model";

const router = Router();

/**
 * @route   GET /api/mocks/mockingpets
 * @desc    Generate mock pets
 * @access  Public
 */
router.get(
  "/mockingpets",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const count = parseInt(req.query["count"] as string) || 10;
      const mockPets = generateMockPets(count);

      res.status(200).json({
        success: true,
        message: `Generated ${count} mock pets`,
        payload: mockPets,
      });
    } catch (error) {
      errorHandler(error as CustomError, req, res, next);
    }
  },
);

/**
 * @route   GET /api/mocks/mockingusers
 * @desc    Generate 50 mock users with encrypted passwords
 * @access  Public
 */
router.get(
  "/mockingusers",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const count = parseInt(req.query["count"] as string) || 50;
      const mockUsers = await generateMockUsers(count);

      res.status(200).json({
        success: true,
        message: `Generated ${count} mock users`,
        payload: mockUsers,
      });
    } catch (error) {
      errorHandler(error as CustomError, req, res, next);
    }
  },
);

/**
 * @route   POST /api/mocks/generateData
 * @desc    Generate and insert mock users and pets into the database
 * @access  Public
 */
router.post(
  "/generateData",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCount = parseInt(req.body.users as string) || 0;
      const petCount = parseInt(req.body.pets as string) || 0;

      const results: { users?: Partial<IUser>[]; pets?: Partial<IPet>[] } = {};

      if (userCount > 0) {
        const mockUsers = await generateMockUsers(userCount);
        results.users = await usersService.insertManyUsers(mockUsers);
      }

      if (petCount > 0) {
        const mockPets = generateMockPets(petCount);

        const petPromises = mockPets.map((pet) => petsService.createPet(pet));
        results.pets = await Promise.all(petPromises);
      }

      res.status(200).json({
        success: true,
        message: `Generated and inserted ${userCount} users and ${petCount} pets`,
        payload: results,
      });
    } catch (error) {
      errorHandler(error as CustomError, req, res, next);
    }
  },
);

export default router;
