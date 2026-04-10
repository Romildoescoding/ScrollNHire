"use client";

import axios from "axios";
import { useState } from "react";

/* ================= TYPES ================= */

export type UpdateProjectPayload = {
  projectId: string;

  title?: string;
  description?: string;
  techStack?: string[];

  githubUrl?: string;
  liveUrl?: string;

  thumbnail?: string;
  images?: string[];
  videoDemo?: string;

  category?: string;
  difficultyLevel?: "beginner" | "intermediate" | "advanced";

  isVerified?: boolean;
};

/* ================= HOOK ================= */

const useUpdateProject = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProject = async (payload: UpdateProjectPayload) => {
    setIsUpdating(true);
    setError(null);

    try {
      const { projectId, ...updateData } = payload;

      const response = await axios.patch(
        `/api/projects/${projectId}`,
        updateData,
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.error || err.message || "Something went wrong";

      setError(message);
      console.error("Error updating project:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateProject,
    isUpdating,
    error,
  };
};

export default useUpdateProject;
