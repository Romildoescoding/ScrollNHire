"use client";
import { useState } from "react";

const useUpdateProfile = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = async (updatedValues: {
    name?: string;
    profTitle?: string;
    image?: string;
    profession?: string;
  }) => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedValues),
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to send details: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
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
