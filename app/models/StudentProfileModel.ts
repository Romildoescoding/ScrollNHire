import mongoose, { Document, Schema } from "mongoose";

export interface IStudentProfile extends Document {
  userId: mongoose.Types.ObjectId;
  collegeId?: mongoose.Types.ObjectId;
  rollno: string;
  degree: string;
  branch: string;
  yearOfPassing: number;
  cgpa?: number;
  resumeUrl?: string;
  skills: string[];
  github?: string;
  linkedin?: string;
  bio?: string;
  verified: boolean;
  createdAt: Date;
}

const studentProfileSchema = new Schema<IStudentProfile>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  collegeId: {
    type: Schema.Types.ObjectId,
    ref: "College",
  },
  rollno: String,
  degree: String,
  branch: String,
  yearOfPassing: Number,
  cgpa: Number,
  resumeUrl: String,
  skills: {
    type: [String],
    default: [],
    index: true,
  },
  github: String,
  linkedin: String,
  bio: String,
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const StudentProfile =
  mongoose.models?.StudentProfile ||
  mongoose.model<IStudentProfile>("StudentProfile", studentProfileSchema);

export default StudentProfile;
