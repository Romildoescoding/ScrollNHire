import { useSession } from "next-auth/react";
import { getUserDetails } from "../_lib/actions";
import { useEffect, useState, useCallback, useRef } from "react";
import { Gender, UserRole } from "../models/UserModel";
import { IStudentProfile } from "../models/StudentProfileModel";
import { IEmployerProfile } from "../models/EmployerProfileModel";

interface User {
  name?: string | null;
  email: string;
  image: string;
  provider: string;
  profession: string;
  professionalTitle: string;
  role: UserRole | null;
  isOnboarded: boolean;
  gender: Gender | null;
  studentProfile?: IStudentProfile | null;
  employerProfile?: IEmployerProfile | null;
}

export function useUserDetails() {
  const fetched = useRef(false);
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    image: "",
    provider: "",
    profession: "",
    professionalTitle: "",
    isOnboarded: false,
    role: null,
    gender: null,
    studentProfile: null,
    employerProfile: null,
  });
  // Can be used to check if the session came right and the user got fetched or not.
  const [status, setStatus] = useState<"loading" | "authenticated" | "error">(
    "loading",
  );
  const { data: session } = useSession();

  // ✅ Create a function to re-fetch user details
  const fetchUser = useCallback(async (email: string | null) => {
    try {
      const fetchedUser = await getUserDetails(email);
      setUser(fetchedUser.user);
      fetched.current = true;
      setStatus("authenticated");
    } catch (error) {
      console.error("Error fetching user:", error);
      setStatus("error");
    }
  }, []);

  // handles the empty user session case with this check
  useEffect(() => {
    if (session?.user?.email) {
      console.log(session?.user?.email);
      fetchUser(session.user.email);
      // setStatus("authenticated");
    } else {
      // no need to fetch the user with no email yk as it is just not there.
      // fetchUser(null);
    }
  }, [session?.user, fetchUser]);

  return {
    user,
    status,
    fetched,
    refetchUser: () => fetchUser(session?.user?.email || null),
  };
}
