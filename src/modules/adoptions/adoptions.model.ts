import { Schema, model } from "mongoose";

export interface IAdoption {
  petId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  adoptionDate: Date;
  status: string;
}

const adoptionSchema = new Schema<IAdoption>({
  petId: {
    type: Schema.Types.ObjectId,
    ref: "Pet",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
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
