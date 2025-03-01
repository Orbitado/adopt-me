import { petsService } from "../../../modules/pets/pets.service";
import { petsDAO } from "../../../modules/pets/dao/pets.dao";
import { CreatePetDTO } from "../../../modules/pets/dto/pet.dto";
import { IPet } from "../../../modules/pets/pets.model";

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

describe("PetsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
      (petsDAO.create as jest.Mock).mockResolvedValue(expectedPet);

      const result = await petsService.createPet(pet);

      expect(petsDAO.create).toHaveBeenCalledWith(pet);
      expect(result).toEqual(expectedPet);
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
  });
});
