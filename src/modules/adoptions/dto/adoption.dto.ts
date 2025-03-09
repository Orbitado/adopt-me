import { z } from "zod";

export const createAdoptionSchema = z.object({
  petId: z.string(),
  userId: z.string(),
  adoptionDate: z.coerce.date(),
  status: z.enum(["pending", "approved", "rejected"], {
    errorMap: () => ({
      message: "Status must be 'pending', 'approved', or 'rejected'",
    }),
  }),
});

export const updateAdoptionSchema = createAdoptionSchema.partial();

export type CreateAdoptionDTO = z.infer<typeof createAdoptionSchema>;
export type UpdateAdoptionDTO = z.infer<typeof updateAdoptionSchema>;

export interface AdoptionResponseDTO extends CreateAdoptionDTO {
  _id: string;
}
