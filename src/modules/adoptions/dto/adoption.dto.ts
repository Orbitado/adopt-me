/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface CreateAdoptionDTO {
  petId: string;
  userId: string;
  adoptionDate: Date;
  status: "pending" | "approved" | "rejected";
}

export interface UpdateAdoptionDTO extends Partial<CreateAdoptionDTO> {}

export interface AdoptionResponseDTO extends CreateAdoptionDTO {
  id: string;
}
