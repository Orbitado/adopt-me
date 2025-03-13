import { Schema, model } from "mongoose";

export interface IAdoption {
  petId: string;
  userId: string;
  adoptionDate: Date;
  status: string;
}

const adoptionSchema = new Schema<IAdoption>({
  petId: {
    type: String,
    ref: "Pet",
    required: true,
  },
  userId: {
    type: String,
    ref: "User",
    required: true,
  },
  adoptionDate: {
    type: Date,
    required: false,
    default: Date.now,
  },
  status: {
    type: String,
    required: false,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

const Adoption = model<IAdoption>("Adoption", adoptionSchema);

export default Adoption;
