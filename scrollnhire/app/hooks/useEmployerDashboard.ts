import { useEffect, useState } from "react";
import axios from "axios";

export type InterviewItem = {
  id: string;
  name: string;
  role: string;
  interviewDate: Date;
  inteviewLink: string;
};

interface DashboardData {
  interviewsTodayCount: number;
  nextInterview: InterviewItem | null;
  interviewsScheduled: InterviewItem[];
}

const defaultData: DashboardData = {
  interviewsTodayCount: 0,
  nextInterview: null,
  interviewsScheduled: [],
};

const useEmployerDashboard = () => {
  const [data, setData] = useState<DashboardData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("/api/dashboard/employer");
        setData(res.data.data);
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

export default useEmployerDashboard;
