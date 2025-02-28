import { Schema, model } from "mongoose";

export interface IPet {
  name: string;
  birthDate: Date;
  breed: string;
  gender: string;
  size: string;
  description: string;
  isAdopted: boolean;
}

const petSchema = new Schema<IPet>({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "Name must be at least 3 characters long"],
    maxlength: [20, "Name must be less than 20 characters"],
    default: "No name provided",
  },
  birthDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  breed: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "Breed must be at least 3 characters long"],
    maxlength: [15, "Breed must be less than 15 characters"],
    default: "No breed provided",
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female"],
    default: "No gender provided",
  },
  size: {
    type: String,
    required: true,
    enum: ["small", "medium", "large"],
    default: "No size provided",
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: [10, "Description must be at least 10 characters long"],
    maxlength: [500, "Description must be less than 500 characters"],
    default: "No description provided",
  },
  isAdopted: {
    type: Boolean,
    default: false,
  },
});

const Pet = model<IPet>("Pet", petSchema);

export default Pet;
