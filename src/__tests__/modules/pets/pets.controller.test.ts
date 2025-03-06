import { Request, Response, NextFunction } from "express";
import { petsController } from "../../../modules/pets/pets.controller";
import { petsService } from "../../../modules/pets/pets.service";
import { ErrorDictionary } from "../../../utils/error-dictionary";
import { CreatePetDTO, UpdatePetDTO } from "../../../modules/pets/dto/pet.dto";
import { CustomError } from "../../../types/types";
import { IPet } from "../../../modules/pets/pets.model";

jest.mock("../../../modules/pets/pets.service", () => ({
  petsService: {
    createPet: jest.fn(),
    getAllPets: jest.fn(),
    getPetById: jest.fn(),
    getPetByName: jest.fn(),
    updatePet: jest.fn(),
    deletePet: jest.fn(),
  },
}));

jest.mock("../../../utils/error-dictionary", () => ({
  ErrorDictionary: {
    resourceExists: jest.fn().mockReturnValue({
      name: "ResourceExistsError",
      message: "Pet already exists",
      status: 400,
      statusCode: 400,
      code: "RESOURCE_EXISTS",
    }),
    resourceNotFound: jest.fn(),
    invalidRequest: jest.fn(),
    unauthorized: jest.fn(),
    forbidden: jest.fn(),
    internalServerError: jest.fn(),
  },
}));

describe("PetsController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe("Create a Pet", () => {
    it("Should create a pet when it doesn't exist", async () => {
      const petData: CreatePetDTO = {
        name: "Buddy",
        birthDate: new Date("2020-01-01"),
        breed: "Labrador",
        gender: "male",
        size: "large",
        description:
          "Buddy is a friendly and energetic dog who loves to play fetch.",
        isAdopted: false,
      };

      mockRequest.body = petData;

      (petsService.getPetByName as jest.Mock).mockResolvedValue(null);
      (petsService.createPet as jest.Mock).mockResolvedValue({
        ...petData,
        _id: "some-id",
      });

      await petsController.createPet(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(petsService.getPetByName).toHaveBeenCalledWith(petData.name);
      expect(petsService.createPet).toHaveBeenCalledWith(petData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: `Pet ${petData.name} created successfully`,
        payload: expect.objectContaining(petData),
      });
    });

    it("Should throw an error when a pet with the same name already exists", async () => {
      const petData: CreatePetDTO = {
        name: "Buddy",
        birthDate: new Date("2020-01-01"),
        breed: "Labrador",
        gender: "male",
        size: "large",
        description:
          "Buddy is a friendly and energetic dog who loves to play fetch.",
        isAdopted: false,
      };

      mockRequest.body = petData;

      (petsService.getPetByName as jest.Mock).mockResolvedValue({
        ...petData,
        _id: "existing-id",
      });

      const resourceExistsError: CustomError = {
        name: "ResourceExistsError",
        message: "Pet already exists",
        status: 400,
        code: "RESOURCE_EXISTS",
      };

      (ErrorDictionary.resourceExists as jest.Mock).mockReturnValue(
        resourceExistsError,
      );

      await petsController.createPet(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(petsService.getPetByName).toHaveBeenCalledWith(petData.name);
      expect(petsService.createPet).not.toHaveBeenCalled();
      expect(ErrorDictionary.resourceExists).toHaveBeenCalledWith("Pet");
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe("Get all Pets", () => {
    it("Should get all pets", async () => {
      const pets: IPet[] = [
        {
          name: "Buddy",
          breed: "Labrador",
          birthDate: new Date("2020-01-01"),
          gender: "male" as "male" | "female",
          size: "large" as "small" | "medium" | "large",
          description:
            "Buddy is a friendly and energetic dog who loves to play fetch.",
          isAdopted: false,
        },
        {
          name: "Max",
          breed: "German Shepherd",
          birthDate: new Date("2020-01-01"),
          gender: "male",
          size: "large",
          description:
            "Max is a friendly and energetic dog who loves to play fetch.",
          isAdopted: false,
        },
      ];

      const expectedPets = pets.map((pet, index) => ({
        ...pet,
        _id: `pet-id-${index}`,
      }));
      (petsService.getAllPets as jest.Mock).mockResolvedValue(expectedPets);

      await petsController.getAllPets(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(petsService.getAllPets).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Pets fetched successfully",
        payload: expectedPets,
      });
    });

    it("Should handle error when fetching all pets fails", async () => {
      const error = new Error("Database error");
      (petsService.getAllPets as jest.Mock).mockRejectedValue(error);

      await petsController.getAllPets(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(petsService.getAllPets).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe("Get a Pet by ID", () => {
    it("Should get a pet by ID", async () => {
      const pet: IPet = {
        name: "Buddy",
        breed: "Labrador",
        birthDate: new Date("2020-01-01"),
        gender: "male" as "male" | "female",
        size: "large" as "small" | "medium" | "large",
        description:
          "Buddy is a friendly and energetic dog who loves to play fetch.",
        isAdopted: false,
      };

      const expectedPet = { ...pet, _id: "existing-id" };
      (petsService.getPetById as jest.Mock).mockResolvedValue(expectedPet);

      mockRequest.params = { id: "existing-id" };

      await petsController.getPetById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(petsService.getPetById).toHaveBeenCalledWith(expectedPet._id);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: `Pet ${expectedPet.name} fetched successfully`,
        payload: expectedPet,
      });
    });

    it("Should return 404 when a pet is not found by ID", async () => {
      const nonExistentId = "nonexistent-id";
      mockRequest.params = { id: nonExistentId };

      (petsService.getPetById as jest.Mock).mockResolvedValue(null);

      const notFoundError: CustomError = {
        name: "ResourceNotFoundError",
        message: "Pet not found",
        status: 404,
        code: "RESOURCE_NOT_FOUND",
      };

      (ErrorDictionary.resourceNotFound as jest.Mock).mockReturnValue(
        notFoundError,
      );

      await petsController.getPetById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(petsService.getPetById).toHaveBeenCalledWith(nonExistentId);
      expect(ErrorDictionary.resourceNotFound).toHaveBeenCalledWith(
        "Pet",
        nonExistentId,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it("Should throw an error when ID is not provided", async () => {
      mockRequest.params = {};

      const invalidRequestError: CustomError = {
        name: "InvalidRequestError",
        message: "Pet ID is required",
        status: 400,
        code: "INVALID_REQUEST",
      };

      (ErrorDictionary.invalidRequest as jest.Mock).mockReturnValue(
        invalidRequestError,
      );

      await petsController.getPetById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(ErrorDictionary.invalidRequest).toHaveBeenCalledWith(
        "Pet ID is required",
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe("Get a Pet by Name", () => {
    it("Should get a pet by name", async () => {
      const pet: IPet = {
        name: "Buddy",
        breed: "Labrador",
        birthDate: new Date("2020-01-01"),
        gender: "male" as "male" | "female",
        size: "large" as "small" | "medium" | "large",
        description:
          "Buddy is a friendly and energetic dog who loves to play fetch.",
        isAdopted: false,
      };

      const expectedPet = { ...pet, _id: "existing-id" };
      (petsService.getPetByName as jest.Mock).mockResolvedValue(expectedPet);

      mockRequest.params = { name: pet.name };

      await petsController.getPetByName(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(petsService.getPetByName).toHaveBeenCalledWith(pet.name);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: `Pet ${expectedPet.name} fetched successfully`,
        payload: expectedPet,
      });
    });

    it("Should throw an error when a pet is not found by name", async () => {
      const nonExistentName = "nonexistent-name";
      mockRequest.params = { name: nonExistentName };

      (petsService.getPetByName as jest.Mock).mockResolvedValue(null);

      const notFoundError: CustomError = {
        name: "ResourceNotFoundError",
        message: "Pet not found",
        status: 404,
        code: "RESOURCE_NOT_FOUND",
      };

      (ErrorDictionary.resourceNotFound as jest.Mock).mockReturnValue(
        notFoundError,
      );

      await petsController.getPetByName(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(petsService.getPetByName).toHaveBeenCalledWith(nonExistentName);
      expect(ErrorDictionary.resourceNotFound).toHaveBeenCalledWith(
        "Pet",
        nonExistentName,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it("Should throw an error when pet name is not provided", async () => {
      mockRequest.params = {}; // No name parameter

      const invalidRequestError: CustomError = {
        name: "InvalidRequestError",
        message: "Pet name is required",
        status: 400,
        code: "INVALID_REQUEST",
      };

      (ErrorDictionary.invalidRequest as jest.Mock).mockReturnValue(
        invalidRequestError,
      );

      await petsController.getPetByName(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(ErrorDictionary.invalidRequest).toHaveBeenCalledWith(
        "Pet name is required",
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe("Update a Pet", () => {
    it("Should update a pet", async () => {
      const pet: IPet = {
        name: "Buddy",
        breed: "Labrador",
        birthDate: new Date("2020-01-01"),
        gender: "male" as "male" | "female",
        size: "large" as "small" | "medium" | "large",
        description:
          "Buddy is a friendly and energetic dog who loves to play fetch.",
        isAdopted: false,
      };

      const updatedPet: UpdatePetDTO = { name: "Buddy Updated" };

      const petId = "existing-id";
      const expectedPet = { ...pet, _id: petId, ...updatedPet };

      mockRequest.params = { id: petId };
      mockRequest.body = updatedPet;

      (petsService.updatePet as jest.Mock).mockResolvedValue(expectedPet);

      await petsController.updatePet(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(petsService.updatePet).toHaveBeenCalledWith(petId, updatedPet);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: `Pet ${expectedPet.name} updated successfully`,
        payload: expectedPet,
      });
    });

    it("Should throw an error when a pet is not found by ID", async () => {
      const updatedPet = { name: "Buddy Updated" };

      const nonExistentId = "nonexistent-id";
      mockRequest.params = { id: nonExistentId };
      mockRequest.body = updatedPet;

      (petsService.updatePet as jest.Mock).mockResolvedValue(null);

      const notFoundError: CustomError = {
        name: "ResourceNotFoundError",
        message: "Pet not found",
        status: 404,
        code: "RESOURCE_NOT_FOUND",
      };

      (ErrorDictionary.resourceNotFound as jest.Mock).mockReturnValue(
        notFoundError,
      );

      await petsController.updatePet(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(petsService.updatePet).toHaveBeenCalledWith(
        nonExistentId,
        updatedPet,
      );
      expect(ErrorDictionary.resourceNotFound).toHaveBeenCalledWith(
        "Pet",
        nonExistentId,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it("Should throw an error when pet ID is not provided", async () => {
      mockRequest.params = {};
      mockRequest.body = { name: "Updated Name" };

      const invalidRequestError: CustomError = {
        name: "InvalidRequestError",
        message: "Pet ID is required",
        status: 400,
        code: "INVALID_REQUEST",
      };

      (ErrorDictionary.invalidRequest as jest.Mock).mockReturnValue(
        invalidRequestError,
      );

      await petsController.updatePet(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(ErrorDictionary.invalidRequest).toHaveBeenCalledWith(
        "Pet ID is required",
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it("Should throw an error when pet data is not provided", async () => {
      mockRequest.params = { id: "pet-id" };
      mockRequest.body = undefined;

      const invalidRequestError: CustomError = {
        name: "InvalidRequestError",
        message: "Pet data is required",
        status: 400,
        code: "INVALID_REQUEST",
      };

      (ErrorDictionary.invalidRequest as jest.Mock).mockReturnValue(
        invalidRequestError,
      );

      await petsController.updatePet(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(ErrorDictionary.invalidRequest).toHaveBeenCalledWith(
        "Pet data is required",
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe("Delete a Pet", () => {
    it("Should delete a pet", async () => {
      const petId = "existing-id";
      mockRequest.params = { id: petId };

      const pet: IPet = {
        name: "Buddy",
        breed: "Labrador",
        birthDate: new Date("2020-01-01"),
        gender: "male" as "male" | "female",
        size: "large" as "small" | "medium" | "large",
        description:
          "Buddy is a friendly and energetic dog who loves to play fetch.",
        isAdopted: false,
      };

      const expectedPet = { ...pet, _id: petId };
      (petsService.deletePet as jest.Mock).mockResolvedValue(expectedPet);

      await petsController.deletePet(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(petsService.deletePet).toHaveBeenCalledWith(petId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: `Pet ${expectedPet.name} deleted successfully`,
        payload: expectedPet,
      });
    });

    it("Should throw an error when ID is not provided for deletion", async () => {
      mockRequest.params = {};

      const invalidRequestError: CustomError = {
        name: "InvalidRequestError",
        message: "Pet ID is required",
        status: 400,
        code: "INVALID_REQUEST",
      };

      (ErrorDictionary.invalidRequest as jest.Mock).mockReturnValue(
        invalidRequestError,
      );

      await petsController.deletePet(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(ErrorDictionary.invalidRequest).toHaveBeenCalledWith(
        "Pet ID is required",
      );
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it("Should throw an error when a pet is not found for deletion", async () => {
      const petId = "nonexistent-id";
      mockRequest.params = { id: petId };

      // Mock petsService.deletePet to return null, indicating the pet was not found
      (petsService.deletePet as jest.Mock).mockResolvedValue(null);

      const notFoundError: CustomError = {
        name: "ResourceNotFoundError",
        message: `Pet not found with id: ${petId}`,
        status: 404,
        code: "RESOURCE_NOT_FOUND",
      };

      (ErrorDictionary.resourceNotFound as jest.Mock).mockReturnValue(
        notFoundError,
      );

      await petsController.deletePet(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(petsService.deletePet).toHaveBeenCalledWith(petId);
      expect(ErrorDictionary.resourceNotFound).toHaveBeenCalledWith(
        "Pet",
        petId,
        { message: `Pet not found with id: ${petId}` },
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });
});
