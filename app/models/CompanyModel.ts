import mongoose, { Document, Schema } from "mongoose";

export interface ICompany extends Document {
  name: string;
  domain?: string;
  employerIds: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const companySchema = new Schema<ICompany>({
  name: { type: String, required: true },
  domain: String,
  employerIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Company ||
  mongoose.model<ICompany>("Company", companySchema);
