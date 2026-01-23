"use client";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const CallbackPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const hasRun = useRef(false); // ✅ prevents double firing

  useEffect(() => {
    async function loginUser() {
      const res = await axios.post("/api/user", {
        ...session?.user,
        provider: "google",
      });
      console.log(res.data);

      // Onboarding process for the user
      if (res.data.isNewUser) {
        router.push("/onboarding");
      } else router.push("/dashboard");

      // const mailRes = await axios.get("/api/mails");
      // console.log(mailRes.data);
    }
    // ✅ stop double POST in dev
    if (hasRun.current) return;
    hasRun.current = true;
    if (session && session.user) loginUser();

    console.log(session);
  }, [session]);
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <Loader2 className="h-7 w-7 animate-spin" />
    </div>
  );
};

export default CallbackPage;
