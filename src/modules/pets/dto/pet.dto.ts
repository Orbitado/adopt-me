/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface CreatePetDTO {
  name: string;
  birthDate: Date;
  breed: string;
  gender: "male" | "female";
  size: "small" | "medium" | "large";
  description: string;
}

export interface UpdatePetDTO extends Partial<CreatePetDTO> {}

export interface PetResponseDTO extends CreatePetDTO {
  id: string;
}
