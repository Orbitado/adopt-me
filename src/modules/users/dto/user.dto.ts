import { z } from "zod";

export const createUserSchema = z.object({
  first_name: z.string().min(2).max(50),
  last_name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  role: z.enum(["admin", "user"]),
  pets: z.array(z.string()).optional(),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.partial();
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;

export interface UserResponseDTO extends CreateUserDTO {
  _id: string;
}
