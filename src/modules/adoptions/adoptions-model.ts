import { Schema, model } from "mongoose";

interface IAdoption {
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
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

const Adoption = model<IAdoption>("Adoption", adoptionSchema);

export default Adoption;
