import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";
import dbConnect from "../app/_lib/dbConnect";

import StudentProfile from "../app/models/StudentProfileModel";
import { Project } from "../app/models/ProjectModel";
import { Reel } from "../app/models/ReelModel";
import { createEmbedding } from "../app/_lib/geminiEmbedding";
import { User } from "../app/models/UserModel";

const BATCH_SIZE = 10; // ⚡ avoid rate limits

/* ===================== STUDENT PROFILES ===================== */

async function updateStudentProfiles() {
  console.log("🔄 Updating Student Profiles...");

  const profiles = await StudentProfile.find().lean();

  for (let i = 0; i < profiles.length; i += BATCH_SIZE) {
    const batch = profiles.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (profile) => {
        try {
          const user = await User.findById(profile.userId).lean();

          const embeddingText = `
This is a student profile.

Name: ${user?.name || ""}
Bio: ${profile.bio || ""}
Skills: ${(profile.skills || []).join(", ")}
Degree: ${profile.degree || ""}
Branch: ${profile.branch || ""}
CGPA: ${profile.cgpa || ""}
          `.trim();

          const embedding = await createEmbedding(embeddingText, "document");

          await StudentProfile.updateOne(
            { _id: profile._id },
            { $set: { embedding } },
          );

          console.log(`✅ Profile updated: ${profile._id}`);
        } catch (err) {
          console.error(`❌ Profile failed: ${profile._id}`, err);
        }
      }),
    );
  }
}

/* ===================== PROJECTS ===================== */

async function updateProjects() {
  console.log("🔄 Updating Projects...");

  const projects = await Project.find().lean();

  for (let i = 0; i < projects.length; i += BATCH_SIZE) {
    const batch = projects.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (project) => {
        try {
          const embeddingText = `
This is a software project.

Title: ${project.title}
Description: ${project.description || ""}
Tech Stack: ${(project.techStack || []).join(", ")}
Category: ${project.category || ""}
Difficulty: ${project.difficultyLevel || ""}
          `.trim();

          const embedding = await createEmbedding(embeddingText, "document");

          await Project.updateOne(
            { _id: project._id },
            { $set: { embedding } },
          );

          console.log(`✅ Project updated: ${project._id}`);
        } catch (err) {
          console.error(`❌ Project failed: ${project._id}`, err);
        }
      }),
    );
  }
}

/* ===================== REELS ===================== */

async function updateReels() {
  console.log("🔄 Updating Reels...");

  const reels = await Reel.find().lean();

  for (let i = 0; i < reels.length; i += BATCH_SIZE) {
    const batch = reels.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (reel) => {
        try {
          const student = await StudentProfile.findOne({
            userId: reel.userId,
          }).lean();

          const embeddingText = `
This is a short video reel created by a student.

Caption: ${reel.caption || ""}
Tags: ${(reel.tags || []).join(", ")}

Creator Skills: ${(student?.skills || []).join(", ")}
          `.trim();

          const embedding = await createEmbedding(embeddingText, "document");

          await Reel.updateOne({ _id: reel._id }, { $set: { embedding } });

          console.log(`✅ Reel updated: ${reel._id}`);
        } catch (err) {
          console.error(`❌ Reel failed: ${reel._id}`, err);
        }
      }),
    );
  }
}

/* ===================== MAIN ===================== */

async function main() {
  try {
    await dbConnect();

    console.log("🚀 Starting embedding backfill...\n");

    await updateStudentProfiles();
    await updateProjects();
    await updateReels();

    console.log("\n🎉 ALL DONE!");
    process.exit(0);
  } catch (err) {
    console.error("💥 Fatal error:", err);
    process.exit(1);
  }
}

main();
