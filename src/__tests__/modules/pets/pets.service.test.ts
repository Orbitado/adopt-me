import { petsService } from "../../../modules/pets/pets.service";
import { petsDAO } from "../../../modules/pets/dao/pets.dao";
import { CreatePetDTO, UpdatePetDTO } from "../../../modules/pets/dto/pet.dto";
import { IPet } from "../../../modules/pets/pets.model";
import { ErrorDictionary } from "../../../utils/error-dictionary";

interface IPetWithId extends IPet {
  _id: string;
}

jest.mock("../../../modules/pets/dao/pets.dao", () => ({
  petsDAO: {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByName: jest.fn(),
  },
}));

const errorMocks = {
  resourceExists: jest.fn(),
  resourceNotFound: jest.fn(),
  invalidRequest: jest.fn(),
};

jest.mock("../../../utils/error-dictionary", () => ({
  ErrorDictionary: {
    resourceExists: jest
      .fn()
      .mockImplementation((...args) => errorMocks.resourceExists(...args)),
    resourceNotFound: jest
      .fn()
      .mockImplementation((...args) => errorMocks.resourceNotFound(...args)),
    invalidRequest: jest
      .fn()
      .mockImplementation((...args) => errorMocks.invalidRequest(...args)),
  },
}));

describe("PetsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    errorMocks.resourceExists.mockReset();
    errorMocks.resourceNotFound.mockReset();
    errorMocks.invalidRequest.mockReset();
  });

  describe("Create a Pet", () => {
    it("Should Create a Pet", async () => {
      const pet: CreatePetDTO = {
        name: "Buddy",
        birthDate: new Date("2020-01-01"),
        breed: "Labrador",
        gender: "male",
        size: "large",
        description:
          "Buddy is a friendly and energetic dog who loves to play fetch.",
        isAdopted: false,
      };

      const expectedPet = { ...pet, _id: "some-uuid" };
      (petsDAO.findByName as jest.Mock).mockResolvedValue(null);
      (petsDAO.create as jest.Mock).mockResolvedValue(expectedPet);

      const result = await petsService.createPet(pet);

      expect(petsDAO.findByName).toHaveBeenCalledWith(pet.name);
      expect(petsDAO.create).toHaveBeenCalledWith(pet);
      expect(result).toEqual(expectedPet);
    });

    it("Should throw error when pet with same name already exists", async () => {
      const pet: CreatePetDTO = {
        name: "Buddy",
        birthDate: new Date("2020-01-01"),
        breed: "Labrador",
        gender: "male",
        size: "large",
        description: "A friendly dog",
        isAdopted: false,
      };

      const existingPet = { ...pet, _id: "existing-id" };
      (petsDAO.findByName as jest.Mock).mockResolvedValue(existingPet);

      errorMocks.resourceExists.mockReturnValue(
        new Error("Pet already exists"),
      );

      await expect(petsService.createPet(pet)).rejects.toThrow(
        "Pet already exists",
      );

      expect(petsDAO.findByName).toHaveBeenCalledWith(pet.name);
      expect(petsDAO.create).not.toHaveBeenCalled();
      expect(ErrorDictionary.resourceExists).toHaveBeenCalledWith("Pet");
    });
  });

  describe("Get All Pets", () => {
    it("Should Get All Pets", async () => {
      const pets: IPet[] = [
        {
          name: "Luna",
          birthDate: new Date("2022-03-15"),
          breed: "Golden",
          gender: "female",
          size: "medium",
          description:
            "Luna is a friendly and energetic dog who loves to play fetch.",
          isAdopted: true,
        },
      ];

      const expectedPets = pets.map((pet) => ({ ...pet, _id: "some-uuid" }));
      (petsDAO.findAll as jest.Mock).mockResolvedValue(expectedPets);

      const result = await petsService.getAllPets();

      expect(petsDAO.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedPets);
    });
  });

  describe("Get Pet By Id", () => {
    it("Should Get a Pet By Id", async () => {
      const pet: IPet = {
        name: "Luna",
        birthDate: new Date("2022-03-15"),
        breed: "Golden",
        gender: "female",
        size: "medium",
        description:
          "Luna is a friendly and energetic dog who loves to play fetch.",
        isAdopted: true,
      };

      const expectedPet = { ...pet, _id: "some-uuid" };
      (petsDAO.findById as jest.Mock).mockResolvedValue(expectedPet);

      const result = await petsService.getPetById(expectedPet._id);

      expect(petsDAO.findById).toHaveBeenCalledWith(expectedPet._id);
      expect(result).toEqual(expectedPet);
    });

    it("Should throw error when id is not provided", async () => {
      const id = "";

      errorMocks.invalidRequest.mockReturnValue(
        new Error("Pet ID is required"),
      );

      await expect(petsService.getPetById(id)).rejects.toThrow(
        "Pet ID is required",
      );

      expect(petsDAO.findById).not.toHaveBeenCalled();
      expect(ErrorDictionary.invalidRequest).toHaveBeenCalledWith(
        "Pet ID is required",
      );
    });
  });

  describe("Get Pet By Name", () => {
    it("Should Get a Pet By Name", async () => {
      const pet: IPet = {
        name: "Luna",
        birthDate: new Date("2022-03-15"),
        breed: "Golden",
        gender: "female",
        size: "medium",
        description:
          "Luna is a friendly and energetic dog who loves to play fetch.",
        isAdopted: true,
      };

      const expectedPet = { ...pet, _id: "some-uuid" };
      (petsDAO.findByName as jest.Mock).mockResolvedValue(expectedPet);

      const result = await petsService.getPetByName(pet.name);

      expect(petsDAO.findByName).toHaveBeenCalledWith(pet.name);
      expect(result).toEqual(expectedPet);
    });

    it("Should throw error when name is not provided", async () => {
      const name = "";

      errorMocks.invalidRequest.mockReturnValue(
        new Error("Pet name is required"),
      );

      await expect(petsService.getPetByName(name)).rejects.toThrow(
        "Pet name is required",
      );

      expect(petsDAO.findByName).not.toHaveBeenCalled();
      expect(ErrorDictionary.invalidRequest).toHaveBeenCalledWith(
        "Pet name is required",
      );
    });
  });

  describe("Update Pet", () => {
    it("Should Update a Pet", async () => {
      const petId = "some-uuid";
      const existingPet: IPetWithId = {
        _id: petId,
        name: "Buddy",
        birthDate: new Date("2020-01-01"),
        breed: "Labrador",
        gender: "male",
        size: "large",
        description: "A friendly dog",
        isAdopted: false,
      };

      const updatedPet: UpdatePetDTO = {
        name: "Buddy Updated",
        description: "Updated description",
      };

      const expectedPet = { ...existingPet, ...updatedPet };

      (petsDAO.findById as jest.Mock).mockResolvedValue(existingPet);
      (petsDAO.findByName as jest.Mock).mockResolvedValue(null);
      (petsDAO.update as jest.Mock).mockResolvedValue(expectedPet);

      const result = await petsService.updatePet(petId, updatedPet);

      expect(petsDAO.findById).toHaveBeenCalledWith(petId);
      expect(petsDAO.findByName).toHaveBeenCalledWith(updatedPet.name);
      expect(petsDAO.update).toHaveBeenCalledWith(petId, updatedPet);
      expect(result).toEqual(expectedPet);
    });

    it("Should throw error when id is not provided", async () => {
      const id = "";
      const updateData = { name: "Updated Name" };

      errorMocks.invalidRequest.mockReturnValue(
        new Error("Pet ID is required"),
      );

      await expect(petsService.updatePet(id, updateData)).rejects.toThrow(
        "Pet ID is required",
      );

      expect(petsDAO.findById).not.toHaveBeenCalled();
      expect(petsDAO.update).not.toHaveBeenCalled();
      expect(ErrorDictionary.invalidRequest).toHaveBeenCalledWith(
        "Pet ID is required",
      );
    });

    it("Should throw error when no update data is provided", async () => {
      const id = "some-id";
      const emptyUpdateData = {};

      errorMocks.invalidRequest.mockReturnValue(
        new Error("No update data provided"),
      );

      await expect(petsService.updatePet(id, emptyUpdateData)).rejects.toThrow(
        "No update data provided",
      );

      expect(petsDAO.findById).not.toHaveBeenCalled();
      expect(petsDAO.update).not.toHaveBeenCalled();
      expect(ErrorDictionary.invalidRequest).toHaveBeenCalledWith(
        "No update data provided",
      );
    });

    it("Should throw error when updating to a name that already exists", async () => {
      const petId = "pet-1";
      const existingPet: IPetWithId = {
        _id: petId,
        name: "Buddy",
        birthDate: new Date("2020-01-01"),
        breed: "Labrador",
        gender: "male",
        size: "large",
        description: "A friendly dog",
        isAdopted: false,
      };

      const updateData = { name: "Max" };
      const anotherPet = {
        _id: "pet-2",
        name: "Max",
      };

      (petsDAO.findById as jest.Mock).mockResolvedValue(existingPet);
      (petsDAO.findByName as jest.Mock).mockResolvedValue(anotherPet);

      errorMocks.resourceExists.mockReturnValue(
        new Error("Pet with this name already exists"),
      );

      await expect(petsService.updatePet(petId, updateData)).rejects.toThrow(
        "Pet with this name already exists",
      );

      expect(petsDAO.findById).toHaveBeenCalledWith(petId);
      expect(petsDAO.findByName).toHaveBeenCalledWith(updateData.name);
      expect(petsDAO.update).not.toHaveBeenCalled();
      expect(ErrorDictionary.resourceExists).toHaveBeenCalledWith(
        "Pet with this name already exists",
      );
    });
  });

  describe("Delete Pet", () => {
    it("Should Delete a Pet", async () => {
      const petId = "some-uuid";
      const pet: IPetWithId = {
        _id: petId,
        name: "Luna",
        birthDate: new Date("2022-03-15"),
        breed: "Golden",
        gender: "female",
        size: "medium",
        description: "A friendly dog",
        isAdopted: false,
      };

      (petsDAO.findById as jest.Mock).mockResolvedValue(pet);
      (petsDAO.delete as jest.Mock).mockResolvedValue(pet);

      const result = await petsService.deletePet(petId);

      expect(petsDAO.findById).toHaveBeenCalledWith(petId);
      expect(petsDAO.delete).toHaveBeenCalledWith(petId);
      expect(result).toEqual(pet);
    });

    it("Should throw error when id is not provided", async () => {
      const id = "";

      errorMocks.invalidRequest.mockReturnValue(
        new Error("Pet ID is required"),
      );

      await expect(petsService.deletePet(id)).rejects.toThrow(
        "Pet ID is required",
      );

      expect(petsDAO.findById).not.toHaveBeenCalled();
      expect(petsDAO.delete).not.toHaveBeenCalled();
      expect(ErrorDictionary.invalidRequest).toHaveBeenCalledWith(
        "Pet ID is required",
      );
    });

    it("Should throw error when trying to delete an adopted pet", async () => {
      const petId = "some-uuid";
      const adoptedPet: IPetWithId = {
        _id: petId,
        name: "Luna",
        birthDate: new Date("2022-03-15"),
        breed: "Golden",
        gender: "female",
        size: "medium",
        description: "A friendly dog",
        isAdopted: true,
      };

      (petsDAO.findById as jest.Mock).mockResolvedValue(adoptedPet);

      errorMocks.invalidRequest.mockReturnValue(
        new Error("Cannot delete a pet that has been adopted"),
      );

      await expect(petsService.deletePet(petId)).rejects.toThrow(
        "Cannot delete a pet that has been adopted",
      );

      expect(petsDAO.findById).toHaveBeenCalledWith(petId);
      expect(petsDAO.delete).not.toHaveBeenCalled();
      expect(ErrorDictionary.invalidRequest).toHaveBeenCalledWith(
        "Cannot delete a pet that has been adopted",
      );
    });
  });
});
