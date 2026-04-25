"use client";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const CallbackPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const hasRun = useRef(false);

  useEffect(() => {
    // ✅ wait until session is ready
    if (status !== "authenticated") return;

    // ✅ prevent double execution
    if (hasRun.current) return;
    hasRun.current = true;

    async function loginUser() {
      if (!session) {
        console.log("Session is null in the /callback");
        return;
      }
      try {
        const res = await axios.post("/api/user", {
          ...session.user,
          provider: "google",
        });

        console.log(res.data);

        if (!res.data.user.isOnboarded) {
          router.push("/onboarding");
        } else if (res.data.user.role === "student") {
          router.push("/student");
        } else {
          router.push("/employer");
        }
      } catch (err) {
        console.error(err);
        router.push("/login"); // fallback safety
      }
    }

    loginUser();
  }, [status]); // 👈 depend on status, not session

  return (
    <div className="flex items-center justify-center h-svh md:h-screen w-full">
      <Loader2 className="h-7 w-7 animate-spin" />
    </div>
  );
};

export default CallbackPage;
