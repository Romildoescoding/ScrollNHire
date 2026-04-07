"use client";
import { useState } from "react";

type StudentProfilePayload = {
  degree?: string;
  branch?: string;
  cgpa?: number;
  skills?: string[];
  github?: string;
  linkedin?: string;
  bio?: string;
  collegeId?: string;
};

type EmployerProfilePayload = {
  designation?: string;
  linkedin?: string;
  bio?: string;
  companyId?: string;
};

type UpdateProfilePayload = {
  name?: string;
  image?: string;
  gender?: string;
  profession?: string;
  professionalTitle?: string;

  studentProfile?: StudentProfilePayload;
  employerProfile?: EmployerProfilePayload;
};

const useUpdateProfile = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (payload: UpdateProfilePayload) => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch(`/api/auth`, {
        method: "PATCH", // ✅ FIXED (was POST)
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to update: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error("Error Updating details:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateProfile,
    isUpdating,
    error,
  };
};

export default useUpdateProfile;
