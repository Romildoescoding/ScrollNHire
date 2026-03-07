import mongoose, { Document, Schema } from "mongoose";
import { Types } from "mongoose";

export interface ICSOProfile extends Document {
  userId: mongoose.Types.ObjectId;
  collegeId: mongoose.Types.ObjectId;
  designation: string;
  createdAt: Date;
}

const csoProfileSchema = new Schema<ICSOProfile>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  collegeId: {
    type: Schema.Types.ObjectId,
    ref: "College",
    required: true,
  },
  designation: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CSOProfile =
  mongoose.models?.CSOProfile ||
  mongoose.model<ICSOProfile>("CSOProfile", csoProfileSchema);

export default CSOProfile;
