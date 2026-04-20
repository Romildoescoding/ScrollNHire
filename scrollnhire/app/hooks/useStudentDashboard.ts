// useStudentDashboard.ts

import { useEffect, useState } from "react";
import axios from "axios";

// types/studentDashboard.ts

export type InterviewItem = {
  id: string;
  name: string;
  role: string;
  interviewDate: Date;
  inteviewLink: string;
};

export type StudentDashboardData = {
  name: string;

  profile: {
    completion: number;
    suggestions: string[];
  };

  interviews: InterviewItem[];

  activity: string[];

  analytics: { date: string; views: number }[];
};

export const EMPTY_DASHBOARD: StudentDashboardData = {
  name: "",

  profile: {
    completion: 0,
    suggestions: [],
  },

  interviews: [],

  activity: [],

  analytics: [],
};

const useStudentDashboard = () => {
  const [data, setData] = useState<StudentDashboardData>(EMPTY_DASHBOARD);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("/api/dashboard/student");

        setData({
          ...EMPTY_DASHBOARD, // ensures missing fields don’t break UI
          ...res.data.data,
        });
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return { data, isLoading };
};

export default useStudentDashboard;
