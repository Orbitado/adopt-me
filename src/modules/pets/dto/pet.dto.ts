import { z } from "zod";

export const createPetSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(20, "Name must be less than 20 characters"),
  birthDate: z.coerce.date(),
  breed: z
    .string()
    .min(3, "Breed must be at least 3 characters long")
    .max(15, "Breed must be less than 15 characters"),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "Gender must be either 'male' or 'female'" }),
  }),
  size: z.enum(["small", "medium", "large"], {
    errorMap: () => ({ message: "Size must be 'small', 'medium', or 'large'" }),
  }),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(500, "Description must be less than 500 characters"),
  isAdopted: z.boolean().optional(),
});

export const updatePetSchema = createPetSchema.partial();

export type CreatePetDTO = z.infer<typeof createPetSchema>;
export type UpdatePetDTO = z.infer<typeof updatePetSchema>;
export interface PetResponseDTO extends CreatePetDTO {
  _id: string;
}
