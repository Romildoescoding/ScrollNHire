import mongoose, { Document, Schema } from "mongoose";
import { Model } from "mongoose";

export type UserRole = "student" | "employer" | "cso";
export type Gender = "male" | "female" | "other";

export interface IUser extends Document {
  name: string;
  email: string;
  provider: "google" | "custom";
  image: string;
  password?: string;
  providerId: string;
  role: UserRole;
  isOnboarded: boolean;
  // dateOfBirth?: Date;
  gender: Gender;
  collegeId?: mongoose.Types.ObjectId;
  professionalTitle?: string;
  profession?: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: String,
  email: { type: String, unique: true, required: true },
  image: { type: String, default: "https://placehold.co/48" },

  provider: {
    type: String,
    enum: ["google", "custom"],
    required: true,
  },

  password: {
    type: String,
    required: function () {
      return this.provider === "custom";
    },
  },

  providerId: { type: String, required: true, unique: true },

  role: {
    type: String,
    enum: ["student", "employer", "cso"],
  },

  isOnboarded: {
    type: Boolean,
    default: false,
  },

  // dateOfBirth: {
  //   type: Date,
  //   required: false, // keep optional initially
  // },

  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },

  collegeId: {
    type: Schema.Types.ObjectId,
    ref: "College",
    required: function () {
      return this.role === "cso"; // required ONLY for CSO role
    },
  },

  professionalTitle: { type: String, default: "" },
  profession: { type: String, default: "" },

  createdAt: { type: Date, default: Date.now },
});

// export default mongoose.models.User ||
//   mongoose.model<IUser>("User", userSchema);

// export default mongoose.model<IUser>("User", userSchema);
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
