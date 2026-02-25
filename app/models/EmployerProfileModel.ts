import mongoose, { Document, Schema } from "mongoose";

export interface IEmployerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  companyId?: mongoose.Types.ObjectId;
  designation: string;
  createdAt: Date;
}

const employerProfileSchema = new Schema<IEmployerProfile>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
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

const EmployerProfile =
  mongoose.models?.EmployerProfile ||
  mongoose.model<IEmployerProfile>("EmployerProfile", employerProfileSchema);

export default EmployerProfile;
