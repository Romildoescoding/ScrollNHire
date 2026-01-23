import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;

  provider: "google" | "custom";
  providerId: string;
  password?: string;

  profileImage?: string;

  // Fashion app specific
  gender?: "male" | "female" | "other";
  height?: number; // in cm
  bodyType?: "lean" | "athletic" | "bulky" | "curvy" | "average";

  stylePreferences?: string[]; // street, gym, classy etc

  primaryAvatar?: mongoose.Types.ObjectId;

  // onboardingCompleted: boolean;

  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
    default: "User",
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  provider: {
    type: String,
    required: true,
    enum: ["google", "custom"],
  },

  providerId: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: function () {
      return this.provider === "custom";
    },
  },

  profileImage: {
    type: String,
  },

  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },

  height: {
    type: Number,
  },

  bodyType: {
    type: String,
    enum: ["lean", "athletic", "bulky", "curvy", "average"],
  },

  stylePreferences: [String],

  primaryAvatar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Avatar",
  },

  // onboardingCompleted: {
  //   type: Boolean,
  //   default: false,
  // },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// MODEL
const User = mongoose.models?.User || mongoose.model<IUser>("User", userSchema);
// const User = mongoose.model<IUser>("User", userSchema);
export default User;
