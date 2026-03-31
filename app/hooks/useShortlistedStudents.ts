import { useState, useEffect } from "react";
import axios from "axios";
import { Gender } from "../models/UserModel";

export type HiringStatus =
  | "shortlisted"
  | "interview_scheduled"
  | "interview_completed"
  | "offer_sent"
  | "rejected"
  | "hired";

export type Reel = {
  _id: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption?: string;
};

export interface IStudent {
  id: string;
  name: string;
  email: string;
  image: string;
  gender: Gender;

  /* 🎓 PROFILE (FLATTENED) */
  collegeId?: string;
  rollno?: string;
  degree?: string;
  branch?: string;
  yearOfPassing?: number;
  cgpa?: number;
  skills: string[];
  github?: string;
  linkedin?: string;
  bio?: string;
  verified: boolean;

  /* 🎬 REELS */
  reels: Reel[];

  /* 📊 HIRING */
  status: HiringStatus;
  role: string;
  interviewDate?: string;

  createdAt: string;
}

const useShortlistedStudents = () => {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  //   const { data: session } = useSession();

  useEffect(() => {
    const fetchemails = async () => {
      //   const userId = session?.user?.id;
      try {
        const res = await axios.get(
          `/api/students?page=${page}&limit=${limit}&search=${search}`,
        );
        setStudents(res.data.students);
        setTotal(res.data.total);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchemails();
  }, [page, limit, search]);

  return {
    students,
    setStudents,
    total,
    search,
    setSearch,
    page,
    setPage,
    limit,
    setLimit,
    isLoading,
  };
};

export default useShortlistedStudents;
