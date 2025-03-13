import { Schema, model } from "mongoose";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  pets: (Schema.Types.ObjectId | string)[];
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "First name must be at least 2 characters long"],
      maxlength: [30, "First name must be less than 30 characters"],
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Last name must be at least 2 characters long"],
      maxlength: [30, "Last name must be less than 30 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    pets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Pet",
      },
    ],
  },
  {
    timestamps: true,
    autoIndex: true,
  },
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });

const User = model<IUser>("User", userSchema);

export default User;
