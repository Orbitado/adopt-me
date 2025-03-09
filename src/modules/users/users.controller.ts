import { Request, Response, NextFunction } from "express";
import { usersService } from "./users.service";
import { CustomError } from "../../types/types";
import { errorHandler } from "../../middlewares/error-handler";
import { ErrorDictionary } from "../../utils/error-dictionary";

export class UsersController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const existingUser = await usersService.getUserByEmail(req.body.email);

      if (existingUser) {
        throw ErrorDictionary.resourceExists("User");
      } else {
        const userData = req.body;
        const user = await usersService.createUser(userData);
        res.status(201).json({
          success: true,
          message: `User ${user.first_name} ${user.last_name} created successfully`,
          payload: user,
        });
      }
    } catch (error) {
      errorHandler(error as CustomError, req, res, next);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await usersService.getAllUsers();
      res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        payload: users,
      });
    } catch (error) {
      errorHandler(error as CustomError, req, res, next);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw ErrorDictionary.invalidRequest("User ID is required");
      }

      const user = await usersService.getUserById(id);
      res.status(200).json({
        success: true,
        message: "User fetched successfully",
        payload: user,
      });
    } catch (error) {
      errorHandler(error as CustomError, req, res, next);
    }
  }

  async getUserByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params;

      if (!email) {
        throw ErrorDictionary.invalidRequest("User email is required");
      }

      const user = await usersService.getUserByEmail(email);

      if (!user) {
        throw ErrorDictionary.resourceNotFound("User", email);
      }

      res.status(200).json({
        success: true,
        message: `User ${user.email} fetched successfully`,
        payload: user,
      });
    } catch (error) {
      errorHandler(error as CustomError, req, res, next);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userData = req.body;

      if (!id) {
        throw ErrorDictionary.invalidRequest("User ID is required");
      }

      if (!userData) {
        throw ErrorDictionary.invalidRequest("User data is required");
      }

      const user = await usersService.updateUser(id, userData);

      if (!user) {
        throw ErrorDictionary.resourceNotFound("User", id);
      }

      res.status(200).json({
        success: true,
        message: `User ${user.first_name} ${user.last_name} updated successfully`,
        payload: user,
      });
    } catch (error) {
      errorHandler(error as CustomError, req, res, next);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        throw ErrorDictionary.invalidRequest("User ID is required");
      }

      const user = await usersService.deleteUser(id);

      if (!user) {
        const details = {
          message: `User not found with id: ${id}`,
        };
        throw ErrorDictionary.resourceNotFound("User", id, details);
      }

      res.status(200).json({
        success: true,
        message: `User ${user.first_name} ${user.last_name} deleted successfully`,
        payload: user,
      });
    } catch (error) {
      errorHandler(error as CustomError, req, res, next);
    }
  }
}

export const usersController = new UsersController();
