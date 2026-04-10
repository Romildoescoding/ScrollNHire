"use client";

import axios from "axios";
import { useState } from "react";

/* ================= TYPES ================= */

export type CreateProjectPayload = {
  title: string;

  description?: string;
  techStack?: string[];

  githubUrl?: string;
  liveUrl?: string;

  thumbnail?: string;
  images?: string[];
  videoUrl?: string;

  category?: string;
  difficultyLevel?: "beginner" | "intermediate" | "advanced";
};

type CreateProjectResponse = {
  success: boolean;
  data: any; // you can replace with IProject if shared types
};

/* ================= HOOK ================= */

const useCreateProject = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = async (payload: CreateProjectPayload) => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await axios.post<CreateProjectResponse>(
        "/api/projects",
        payload,
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.error || err.message || "Something went wrong";

      setError(message);
      console.error("Error creating project:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createProject,
    isCreating,
    error,
  };
};

export default useCreateProject;
