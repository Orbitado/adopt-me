import { Schema, model } from "mongoose";

export interface IUser {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  pets: Schema.Types.ObjectId[];
}

const userSchema = new Schema<IUser>(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "First name must be at least 2 characters long"],
      maxlength: [50, "First name must be less than 50 characters"],
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Last name must be at least 2 characters long"],
      maxlength: [50, "Last name must be less than 50 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
      minlength: [5, "Email must be at least 5 characters long"],
      maxlength: [50, "Email must be less than 50 characters"],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
      maxlength: [100, "Password must be less than 100 characters"],
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
    pets: {
      type: [Schema.Types.ObjectId],
      ref: "Pet",
      default: [],
    },
  },
  {
    timestamps: true,
    autoIndex: true,
  },
);

const User = model<IUser>("User", userSchema);

export default User;
