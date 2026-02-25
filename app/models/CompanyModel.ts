import mongoose, { Document, Schema } from "mongoose";

export interface ICompany extends Document {
  name: string;
  logo?: string;
  recruiterIds: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const companySchema = new Schema<ICompany>({
  name: { type: String, required: true },
  logo: String,
  recruiterIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Company ||
  mongoose.model<ICompany>("Company", companySchema);
