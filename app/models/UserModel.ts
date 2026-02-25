import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "student" | "recruiter" | "cso";

export interface IUser extends Document {
  name: string;
  email: string;
  provider: "google" | "custom";
  image: string;
  password?: string;
  providerId: string;
  role: UserRole;
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
    enum: ["student", "recruiter", "cso"],
    default: "student",
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

export default mongoose.models.User ||
  mongoose.model<IUser>("User", userSchema);

// export default mongoose.model<IUser>("User", userSchema);
