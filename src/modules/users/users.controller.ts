import { Request, Response, NextFunction } from "express";
import { usersService } from "./users.service";
import { CustomError } from "../../types/types";
import { errorHandler } from "../../middlewares/error-handler";
import { ErrorDictionary } from "../../utils/error-dictionary";
import { CreateUserDTO } from "./dto/user.dto";

export class UsersController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: CreateUserDTO = req.body;
      const user = await usersService.createUser(userData);

      res.status(201).json({
        success: true,
        message: `User ${user.email} created successfully`,
        payload: user,
      });
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

      if (!user) {
        throw ErrorDictionary.resourceNotFound("User", id);
      }

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

      const user = await usersService.updateUser(id, userData);

      if (!user) {
        throw ErrorDictionary.resourceNotFound("User", id);
      }

      res.status(200).json({
        success: true,
        message: `User ${user.email} updated successfully`,
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
        throw ErrorDictionary.resourceNotFound("User", id);
      }

      res.status(200).json({
        success: true,
        message: `User ${user.email} deleted successfully`,
        payload: user,
      });
    } catch (error) {
      errorHandler(error as CustomError, req, res, next);
    }
  }
}

export const usersController = new UsersController();
