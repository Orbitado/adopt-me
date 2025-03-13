import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { Types } from "mongoose";

// Keep track of used names to avoid duplicates
const usedPetNames = new Set<string>();

/**
 * Generate a random mock pet
 */
export const generateMockPet = () => {
  const genders = ["male", "female"] as const;
  const sizes = ["small", "medium", "large"] as const;
  const isAdopted = Math.random() > 0.5;

  const dogNames = [
    "Buddy",
    "Max",
    "Charlie",
    "Cooper",
    "Milo",
    "Rocky",
    "Bear",
    "Leo",
    "Duke",
    "Teddy",
  ];

  const dogBreeds = [
    "Labrador",
    "Beagle",
    "Poodle",
    "Boxer",
    "Bulldog",
    "Chihuahua",
    "Husky",
    "Terrier",
    "Collie",
    "Pug",
  ];

  let name: string;
  do {
    const baseName = faker.helpers.arrayElement(dogNames);
    const uniqueSuffix = faker.string.alphanumeric(4);
    name = `${baseName}-${uniqueSuffix}`;
  } while (usedPetNames.has(name));

  usedPetNames.add(name);

  return {
    _id: new Types.ObjectId(),
    name,
    birthDate: faker.date.past({ years: 5 }),
    breed: faker.helpers.arrayElement(dogBreeds),
    gender: faker.helpers.arrayElement(genders),
    size: faker.helpers.arrayElement(sizes),
    description: faker.lorem.paragraph(2),
    isAdopted,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
};

/**
 * Generate multiple mock pets
 * @param count Number of pets to generate
 */
export const generateMockPets = (count: number) => {
  const pets = [];
  for (let i = 0; i < count; i++) {
    pets.push(generateMockPet());
  }
  return pets;
};

/**
 * Generate a random mock user
 */
export const generateMockUser = async () => {
  const hashedPassword = await bcrypt.hash("coder123", 10);

  return {
    _id: new Types.ObjectId(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: hashedPassword,
    role: faker.helpers.arrayElement(["user", "admin"]),
    pets: [],
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
};

/**
 * Generate multiple mock users
 * @param count Number of users to generate
 */
export const generateMockUsers = async (count: number) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push(await generateMockUser());
  }
  return users;
};
