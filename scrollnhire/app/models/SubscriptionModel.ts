import mongoose, { Document, Schema } from "mongoose";

export interface ISubscription extends Document {
  collegeId: mongoose.Types.ObjectId;
  plan: "free" | "basic" | "premium";
  expiry: Date;
  createdAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>({
  collegeId: { type: Schema.Types.ObjectId, ref: "College", required: true },
  plan: {
    type: String,
    enum: ["free", "basic", "premium"],
    default: "free",
  },
  expiry: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Subscription ||
  mongoose.model<ISubscription>("Subscription", subscriptionSchema);
