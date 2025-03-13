import { Request, Response, NextFunction } from "express";
import { petsController } from "../../../modules/pets/pets.controller";
import { petsService } from "../../../modules/pets/pets.service";
import { CreatePetDTO, UpdatePetDTO } from "../../../modules/pets/dto/pet.dto";
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

      (petsService.createPet as jest.Mock).mockResolvedValue({
        ...petData,
        _id: "some-id",
      });

      await petsController.createPet(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(petsService.createPet).toHaveBeenCalledWith(petData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: `Pet ${petData.name} created successfully`,
        payload: expect.objectContaining(petData),
      });
    });

    it("Should handle error when a pet with the same name already exists", async () => {
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

      const resourceExistsError = new Error("Pet already exists");
      resourceExistsError.name = "ResourceExistsError";

      (petsService.createPet as jest.Mock).mockRejectedValue(
        resourceExistsError,
      );

      await petsController.createPet(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(petsService.createPet).toHaveBeenCalledWith(petData);
      expect(mockNext).toHaveBeenCalledWith(resourceExistsError);
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
      expect(mockNext).toHaveBeenCalledWith(error);
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

      expect(petsService.getPetById).toHaveBeenCalledWith("existing-id");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: `Pet ${expectedPet.name} fetched successfully`,
        payload: expectedPet,
      });
    });

    it("Should pass error to next when a pet is not found by ID", async () => {
      const nonExistentId = "nonexistent-id";
      mockRequest.params = { id: nonExistentId };

      const notFoundError = new Error("Pet not found");
      notFoundError.name = "ResourceNotFoundError";

      (petsService.getPetById as jest.Mock).mockRejectedValue(notFoundError);

      await petsController.getPetById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(petsService.getPetById).toHaveBeenCalledWith(nonExistentId);
      expect(mockNext).toHaveBeenCalledWith(notFoundError);
    });

    it("Should pass error to next when ID is not provided", async () => {
      mockRequest.params = {};

      const invalidRequestError = new Error("Pet ID is required");
      invalidRequestError.name = "InvalidRequestError";

      (petsService.getPetById as jest.Mock).mockRejectedValue(
        invalidRequestError,
      );

      await petsController.getPetById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(petsService.getPetById).toHaveBeenCalledWith("");
      expect(mockNext).toHaveBeenCalledWith(invalidRequestError);
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

      mockRequest.params = { name: "Buddy" };

      await petsController.getPetByName(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(petsService.getPetByName).toHaveBeenCalledWith("Buddy");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: `Pet ${expectedPet.name} fetched successfully`,
        payload: expectedPet,
      });
    });

    it("Should pass error to next when a pet is not found by name", async () => {
      const nonExistentName = "nonexistent-name";
      mockRequest.params = { name: nonExistentName };

      const notFoundError = new Error("Pet not found");
      notFoundError.name = "ResourceNotFoundError";

      (petsService.getPetByName as jest.Mock).mockRejectedValue(notFoundError);

      await petsController.getPetByName(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(petsService.getPetByName).toHaveBeenCalledWith(nonExistentName);
      expect(mockNext).toHaveBeenCalledWith(notFoundError);
    });

    it("Should pass error to next when pet name is not provided", async () => {
      mockRequest.params = {};

      const invalidRequestError = new Error("Pet name is required");
      invalidRequestError.name = "InvalidRequestError";

      (petsService.getPetByName as jest.Mock).mockRejectedValue(
        invalidRequestError,
      );

      await petsController.getPetByName(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(petsService.getPetByName).toHaveBeenCalledWith("");
      expect(mockNext).toHaveBeenCalledWith(invalidRequestError);
    });
  });

  describe("Update a Pet", () => {
    it("Should update a pet", async () => {
      const petId = "existing-id";
      const updateData: UpdatePetDTO = {
        name: "Buddy Updated",
        description: "Updated description",
      };

      mockRequest.params = { id: petId };
      mockRequest.body = updateData;

      const updatedPet = {
        _id: petId,
        name: updateData.name,
        description: updateData.description,
        breed: "Labrador",
        gender: "male",
        size: "large",
        birthDate: new Date("2020-01-01"),
        isAdopted: false,
      };

      (petsService.updatePet as jest.Mock).mockResolvedValue(updatedPet);

      await petsController.updatePet(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(petsService.updatePet).toHaveBeenCalledWith(petId, updateData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: `Pet ${updatedPet.name} updated successfully`,
        payload: updatedPet,
      });
    });

    it("Should pass error to next when a pet is not found for update", async () => {
      const nonExistentId = "nonexistent-id";
      const updateData: UpdatePetDTO = {
        name: "Buddy Updated",
      };

      mockRequest.params = { id: nonExistentId };
      mockRequest.body = updateData;

      const notFoundError = new Error("Pet not found");
      notFoundError.name = "ResourceNotFoundError";

      (petsService.updatePet as jest.Mock).mockRejectedValue(notFoundError);

      await petsController.updatePet(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(petsService.updatePet).toHaveBeenCalledWith(
        nonExistentId,
        updateData,
      );
      expect(mockNext).toHaveBeenCalledWith(notFoundError);
    });

    it("Should pass error to next when pet ID is not provided for update", async () => {
      const updateData: UpdatePetDTO = {
        name: "Buddy Updated",
      };

      mockRequest.params = {};
      mockRequest.body = updateData;

      const invalidRequestError = new Error("Pet ID is required");
      invalidRequestError.name = "InvalidRequestError";

      (petsService.updatePet as jest.Mock).mockRejectedValue(
        invalidRequestError,
      );

      await petsController.updatePet(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(petsService.updatePet).toHaveBeenCalledWith("", updateData);
      expect(mockNext).toHaveBeenCalledWith(invalidRequestError);
    });

    it("Should pass error to next when pet data is not provided", async () => {
      const petId = "existing-id";
      mockRequest.params = { id: petId };
      mockRequest.body = {};

      const invalidRequestError = new Error("No update data provided");
      invalidRequestError.name = "InvalidRequestError";

      (petsService.updatePet as jest.Mock).mockRejectedValue(
        invalidRequestError,
      );

      await petsController.updatePet(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(petsService.updatePet).toHaveBeenCalledWith(petId, {});
      expect(mockNext).toHaveBeenCalledWith(invalidRequestError);
    });
  });

  describe("Delete a Pet", () => {
    it("Should delete a pet", async () => {
      const petId = "existing-id";
      mockRequest.params = { id: petId };

      const deletedPet = {
        _id: petId,
        name: "Buddy",
        breed: "Labrador",
        gender: "male",
        size: "large",
        birthDate: new Date("2020-01-01"),
        description: "A friendly dog",
        isAdopted: false,
      };

      (petsService.deletePet as jest.Mock).mockResolvedValue(deletedPet);

      await petsController.deletePet(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(petsService.deletePet).toHaveBeenCalledWith(petId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: `Pet ${deletedPet.name} deleted successfully`,
        payload: deletedPet,
      });
    });

    it("Should pass error to next when pet ID is not provided for deletion", async () => {
      mockRequest.params = {};

      const invalidRequestError = new Error("Pet ID is required");
      invalidRequestError.name = "InvalidRequestError";

      (petsService.deletePet as jest.Mock).mockRejectedValue(
        invalidRequestError,
      );

      await petsController.deletePet(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(petsService.deletePet).toHaveBeenCalledWith("");
      expect(mockNext).toHaveBeenCalledWith(invalidRequestError);
    });

    it("Should pass error to next when a pet is not found for deletion", async () => {
      const nonExistentId = "nonexistent-id";
      mockRequest.params = { id: nonExistentId };

      const notFoundError = new Error("Pet not found");
      notFoundError.name = "ResourceNotFoundError";

      (petsService.deletePet as jest.Mock).mockRejectedValue(notFoundError);

      await petsController.deletePet(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(petsService.deletePet).toHaveBeenCalledWith(nonExistentId);
      expect(mockNext).toHaveBeenCalledWith(notFoundError);
    });
  });
});
