import mongoose, { Document, Schema } from "mongoose";

export interface ICollege extends Document {
  name: string;
  logo?: string;
  location?: string;
  subscriptionId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const collegeSchema = new Schema<ICollege>({
  name: { type: String, required: true },
  logo: { type: String },
  location: { type: String },
  subscriptionId: {
    type: Schema.Types.ObjectId,
    ref: "Subscription",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.College ||
  mongoose.model<ICollege>("College", collegeSchema);
