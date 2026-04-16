// import dotenv from "dotenv";
// dotenv.config({ path: ".env.local" });

// import { GoogleGenAI } from "@google/genai";

// if (!process.env.GEMINI_API_KEY) {
//   throw new Error("GEMINI_API_KEY not found in env");
// }

// const client = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY not found in env");
}

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function createEmbedding(
  text: string,
  type: "query" | "document" = "query",
) {
  const res = await client.models.embedContent({
    model: "gemini-embedding-001",
    contents: [text],
    config: {
      taskType: type === "query" ? "RETRIEVAL_QUERY" : "RETRIEVAL_DOCUMENT",
      outputDimensionality: 1536, // reduced from 3072
    },
  });

  return res.embeddings?.[0]?.values || [];
}
