"use client";
import { useState } from "react";
import { HiringStatus } from "./useStudents";
import axios from "axios";

const useUpdateStatus = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async ({
    hiringProcessId,
    status,
  }: {
    hiringProcessId: string;
    status: HiringStatus;
  }) => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await axios.patch(
        `/api/hiring/status`,
        { hiringProcessId, status },
        {
          withCredentials: true,
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to update: ${response.statusText}`);
      }

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
    updateStatus,
    isUpdating,
    error,
  };
};

export default useUpdateStatus;
