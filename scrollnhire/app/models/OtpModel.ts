import mongoose, { Schema, models, model } from "mongoose";

const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },

    otp: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },
  },

  {
    timestamps: true,
  },
);

export const OTP = models.OTP || model("OTP", otpSchema);
