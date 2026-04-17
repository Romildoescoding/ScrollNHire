"use client";
import { SessionProvider, useSession } from "next-auth/react";

// import { useEffect, useState } from "react";

import {
  BarChart3,
  FileText,
  // Mail,
  // Users,
  // Building2,
  Code2,
  PanelLeftOpen,
  PanelLeftClose,
  User2,
  Megaphone,
  // LogOutIcon,
  List,
  Banknote,
  // TrendingUp,
  Mails,
  PlusCircle,
  Send,
  AlertTriangle,
  Trash2,
  Archive,
  Bell,
  ListTodo,
  Home,
  SquarePlay,
  BriefcaseBusiness,
  Compass,
  Laptop,
  Plus,
  MessageCircleMore,
  Folders,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

// import AuthGuard from "../components/AuthGuard";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
// import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AppLayout from "@/components/app-layout";
import { useUserDetails } from "@/app/hooks/useUserDetails";
import { useUploadProgress } from "@/app/context/ReelUploadContext";
import axios from "axios";
import { useSidebar } from "@/app/context/SidebarContext";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  // const [hideLayout, setHideLayout] = useState(false);
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [role, setRole] = useState<"student" | "employer" | "cso" | null>(null);
  const { user } = useUserDetails();
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const fetchUnreadNotifications = async () => {
    try {
      const res = await axios.get("/api/notifications/unread");

      const data = res.data;
      setUnreadNotifications(data.unreadCount || 0);
    } catch (err) {
      console.error("FETCH_NOTIFICATIONS_ERROR:", err);
    }
  };

  useEffect(() => {
    // if (pathname === "/dashboard/student") {
    //   setRole("student");
    // } else if (pathname === "/dashboard/recruiter") {
    //   setRole("employer");
    // } else if (pathname === "/dashboard/cso") {
    //   setRole("cso");
    // } else {
    //   setRole(null);
    // }

    // OR
    setRole(user.role);
  }, [user.role]);

  useEffect(() => {
    fetchUnreadNotifications();
  }, []);

  const { uploadProgress } = useUploadProgress();

  return (
    // <SessionProvider>
    // <div className="bg-zinc-100 dark:bg-zinc-900 py-2 pr-2 flex min-h-[calc(100vh-56px)]">
    <div className="bg-zinc-100 dark:bg-zinc-900 py-2 pr-2 flex max-h-screen min-h-[calc(100dvh-56px)] overflow-hidden">
      {/* {uploadProgress > -1 && ( */}

      <motion.div
        // style={{ top: 1 > -1 ? "64px" : "-32px" }}
        style={{ top: uploadProgress > -1 ? "64px" : "-32px" }}
        className="w-full transition-all duration-500 bg-transparent fixed top-14 right-2 h-8 flex z-8"
      >
        <div
          className={cn(
            "h-full transition-all duration-500",
            isSidebarOpen ? "w-[200px] md:w-[264px]" : "w-[0px] md:w-[88px]",
          )}
        />

        <div className="flex-1 transition-all border-b border-border duration-500 h-full bg-background flex justify-center items-center">
          <span className="text-foreground text-sm mr-3 whitespace-nowrap">
            Uploading reel
          </span>

          <div className="w-full max-w-2xl h-2 bg-muted rounded overflow-hidden">
            <div
              className="h-full bg-foreground transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>

          <span className="text-muted-foreground text-xs ml-3 w-10 text-right">
            {uploadProgress}%
          </span>
        </div>
      </motion.div>
      {/* // )} */}

      {/* Sidebar */}

      <div
        className={cn(
          "h-full z-[10] w-full bg-[#000000bd] left-0 top-0 transition-all opacity-1 duration-500 fixed",
          isSidebarOpen
            ? "pointer-events-auto opacity-100 md:hidden"
            : " pointer-events-none opacity-0  md:hidden",
        )}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <div
        className={cn(
          "fixed z-[10] max-h-screen min-h-screen left-2 top-0 h-full flex flex-col md:flex md:relative transition-all duration-500 overflow-hidden",
          // "fixed z-[10] max-h-screen min-h-screen left-4 top-0 h-full bg-white dark:bg-zinc-900 flex flex-col md:flex md:relative transition-all duration-500 overflow-hidden",
          isSidebarOpen ? "w-48 md:w-64" : "w-[0px] md:w-[80px]",
        )}
        style={{ position: "sticky" }}
      >
        <Link
          href="/"
          className="w-full max-w-fit p-4 pb-2 flex cursor-pointer justify-start overflow-hidden"
          // add the one for cso too.
          // onClick={() =>
          //   router.push(role === "student" ? "/student" : "/employer")
          // }
        >
          <Image
            alt="logo"
            width="24"
            height="24"
            className="me-1 rounded-[5px] transition-all "
            // style={{ color: "transparent" }}
            src="/logo.webp"
          />

          <span
            style={{ opacity: isSidebarOpen ? "100" : "0" }}
            className="transition-all ml-2 duration-300"
          >
            ScrollnHire
          </span>
        </Link>
        <nav
          className="flex-1 overflow-x-hidden overflow-y-auto py-4"
          style={{ overflowY: isSidebarOpen ? "auto" : "hidden" }}
        >
          {/* MAIN FEATURES */}
          <div className="px-2 py-2 pr-8 flex flex-col gap-1">
            {/* <h2 className="mb-2 relative px-2 text-xs font-semibold tracking-tight">
              <span
                className="transition-all duration-500"
                style={{ opacity: isSidebarOpen ? "100" : "0" }}
              >
                Main
              </span>
              <span
                className="transition-all duration-500 absolute top-0 left-2"
                style={{ opacity: !isSidebarOpen ? "100" : "0" }}
              >
                -----
              </span>
            </h2> */}
            <div className="space-y-1 flex flex-col gap-1">
              <Button
                variant={
                  ["/student", "/employer"].includes(pathname)
                    ? "secondary"
                    : "ghost"
                }
                className={cn(
                  "w-full pl-2 cursor-pointer justify-start overflow-hidden shadow-zinc-300 dark:shadow-[#14141b]",
                  ["/student", "/employer"].includes(pathname)
                    ? "bg-zinc-50 hover:bg-white dark:hover:bg-zinc-700 dark:bg-zinc-800"
                    : "hover:bg-[#fcfcfc] dark:hover:bg-accent/50",
                )}
                disabled={role === null}
                // add the one for cso too.
                onClick={() =>
                  router.push(role === "student" ? "/student" : "/employer")
                }
              >
                <Home className="text-zinc-500 dark:text-zinc-400 mr-2" />
                <span
                  style={{ opacity: isSidebarOpen ? "100" : "0" }}
                  className={cn(
                    "transition-all duration-300",
                    !["/student", "/employer"].includes(pathname) &&
                      "text-zinc-500 dark:text-zinc-400",
                  )}
                >
                  Home
                </span>
              </Button>

              <Button
                variant={pathname === "/jobs" ? "secondary" : "ghost"}
                className={cn(
                  "w-full pl-2 cursor-pointer justify-start overflow-hidden shadow-zinc-300 dark:shadow-[#14141b]",
                  pathname === "/jobs"
                    ? "bg-white hover:bg-white dark:hover:bg-zinc-800 dark:bg-zinc-800"
                    : "hover:bg-[#fcfcfc] dark:hover:bg-accent/50",
                )}
                onClick={() => router.push("/jobs")}
              >
                <BriefcaseBusiness className="text-zinc-500 dark:text-zinc-400 mr-2 h-4 w-4" />
                <span
                  style={{ opacity: isSidebarOpen ? "100" : "0" }}
                  className={cn(
                    "transition-all duration-300",
                    pathname !== "/jobs" && "text-zinc-500 dark:text-zinc-400",
                  )}
                >
                  Job Profiles
                </span>
              </Button>
              <Button
                variant={pathname === "/profile" ? "secondary" : "ghost"}
                className={cn(
                  "w-full pl-2 cursor-pointer justify-start overflow-hidden shadow-zinc-300 dark:shadow-[#14141b]",
                  pathname === "/profile"
                    ? "bg-white hover:bg-white dark:hover:bg-zinc-800 dark:bg-zinc-800"
                    : "hover:bg-[#fcfcfc] dark:hover:bg-accent/50",
                )}
                onClick={() => router.push("/profile")}
              >
                <User2 className="text-zinc-500 dark:text-zinc-400 mr-2 h-4 w-4" />
                <span
                  style={{ opacity: isSidebarOpen ? "100" : "0" }}
                  className={cn(
                    "transition-all duration-300",
                    pathname !== "/profile" &&
                      "text-zinc-500 dark:text-zinc-400",
                  )}
                >
                  My Profile
                </span>
              </Button>
              {user.role === "student" && (
                <Button
                  variant={pathname === "/projects" ? "secondary" : "ghost"}
                  className={cn(
                    "w-full pl-2 cursor-pointer justify-start overflow-hidden shadow-zinc-300 dark:shadow-[#14141b]",
                    pathname === "/profile"
                      ? "bg-white hover:bg-white dark:hover:bg-zinc-800 dark:bg-zinc-800"
                      : "hover:bg-[#fcfcfc] dark:hover:bg-accent/50",
                  )}
                  onClick={() => router.push("/projects")}
                >
                  <Folders className="text-zinc-500 dark:text-zinc-400 mr-2 h-4 w-4" />
                  <span
                    style={{ opacity: isSidebarOpen ? "100" : "0" }}
                    className={cn(
                      "transition-all duration-300",
                      pathname !== "/projects" &&
                        "text-zinc-500 dark:text-zinc-400",
                    )}
                  >
                    Projects
                  </span>
                </Button>
              )}
              {user.role === "employer" && (
                <Button
                  variant={pathname === "/manage" ? "secondary" : "ghost"}
                  className={cn(
                    "w-full pl-2 cursor-pointer justify-start overflow-hidden shadow-zinc-300 dark:shadow-[#14141b]",
                    pathname === "/manage"
                      ? "bg-white hover:bg-white dark:hover:bg-zinc-800 dark:bg-zinc-800"
                      : "hover:bg-[#fcfcfc] dark:hover:bg-accent/50",
                  )}
                  onClick={() => router.push("/manage")}
                >
                  <GraduationCap className="text-zinc-500 dark:text-zinc-400 mr-2 h-4 w-4" />
                  <span
                    style={{ opacity: isSidebarOpen ? "100" : "0" }}
                    className={cn(
                      "transition-all duration-300",
                      pathname !== "/manage" &&
                        "text-zinc-500 dark:text-zinc-400",
                    )}
                  >
                    Manage Students
                  </span>
                </Button>
              )}

              <Button
                variant={pathname === "/interviews" ? "secondary" : "ghost"}
                className={cn(
                  "w-full pl-2 cursor-pointer justify-start overflow-hidden shadow-zinc-300 dark:shadow-[#14141b]",
                  pathname === "/interviews"
                    ? "bg-white hover:bg-white dark:hover:bg-zinc-800 dark:bg-zinc-800"
                    : "hover:bg-[#fcfcfc] dark:hover:bg-accent/50",
                )}
                onClick={() => router.push("/interviews")}
              >
                <Laptop className="text-zinc-500 dark:text-zinc-400 mr-2 h-4 w-4" />
                <span
                  style={{ opacity: isSidebarOpen ? "100" : "0" }}
                  className={cn(
                    "transition-all duration-300",
                    pathname !== "/interviews" &&
                      "text-zinc-500 dark:text-zinc-400",
                  )}
                >
                  Interviews
                </span>
              </Button>
              <Button
                variant={pathname === "/chat" ? "secondary" : "ghost"}
                className={cn(
                  "w-full pl-2 cursor-pointer justify-start overflow-hidden shadow-zinc-300 dark:shadow-[#14141b]",
                  pathname === "/chat"
                    ? "bg-white hover:bg-white dark:hover:bg-zinc-800 dark:bg-zinc-800"
                    : "hover:bg-[#fcfcfc] dark:hover:bg-accent/50",
                )}
                onClick={() => router.push("/chat")}
              >
                <MessageCircleMore className="text-zinc-500 dark:text-zinc-400 mr-2 h-4 w-4" />
                <span
                  style={{ opacity: isSidebarOpen ? "100" : "0" }}
                  className={cn(
                    "transition-all duration-300",
                    pathname !== "/chat" && "text-zinc-500 dark:text-zinc-400",
                  )}
                >
                  Chats
                </span>
              </Button>

              <Button
                variant={pathname.includes("/reels") ? "secondary" : "ghost"}
                className={cn(
                  "w-full pl-2 cursor-pointer justify-start overflow-hidden shadow-zinc-300 dark:shadow-[#14141b]",
                  pathname.includes("/reels")
                    ? "bg-white hover:bg-white dark:hover:bg-zinc-800 dark:bg-zinc-800"
                    : "hover:bg-[#fcfcfc] dark:hover:bg-accent/50",
                )}
                onClick={() => router.push("/reels")}
              >
                <SquarePlay className="text-zinc-500 dark:text-zinc-400 mr-2 h-4 w-4" />
                <span
                  style={{ opacity: isSidebarOpen ? "100" : "0" }}
                  className={cn(
                    "transition-all duration-300",
                    !pathname.includes("/reels") &&
                      "text-zinc-500 dark:text-zinc-400",
                  )}
                >
                  Reels
                </span>
              </Button>

              <Button
                variant={pathname === "/explore" ? "secondary" : "ghost"}
                className={cn(
                  "w-full pl-2 cursor-pointer justify-start overflow-hidden shadow-zinc-300 dark:shadow-[#14141b]",
                  pathname === "/explore"
                    ? "bg-white hover:bg-white dark:hover:bg-zinc-800 dark:bg-zinc-800"
                    : "hover:bg-[#fcfcfc] dark:hover:bg-accent/50",
                )}
                onClick={() => router.push("/explore")}
              >
                <Compass className="text-zinc-500 dark:text-zinc-400 mr-2 h-4 w-4" />
                <span
                  style={{ opacity: isSidebarOpen ? "100" : "0" }}
                  className={cn(
                    "transition-all duration-300",
                    pathname !== "/explore" &&
                      "text-zinc-500 dark:text-zinc-400",
                  )}
                >
                  Explore
                </span>
              </Button>

              {role === "student" && (
                <Button
                  variant={pathname === "/create" ? "secondary" : "ghost"}
                  className={cn(
                    "w-full pl-2 cursor-pointer justify-start overflow-hidden shadow-zinc-300 dark:shadow-[#14141b]",
                    pathname === "/create"
                      ? "bg-white hover:bg-white dark:hover:bg-zinc-800 dark:bg-zinc-800"
                      : "hover:bg-[#fcfcfc] dark:hover:bg-accent/50",
                  )}
                  onClick={() => router.push("/create")}
                >
                  <Plus className="text-zinc-500 dark:text-zinc-400 mr-2 h-4 w-4" />
                  <span
                    style={{ opacity: isSidebarOpen ? "100" : "0" }}
                    className={cn(
                      "transition-all duration-300",
                      pathname !== "/create" &&
                        "text-zinc-500 dark:text-zinc-400",
                    )}
                  >
                    Create
                  </span>
                </Button>
              )}
              <Button
                variant={pathname === "/notifications" ? "secondary" : "ghost"}
                className="w-full pl-2 relative cursor-pointer justify-start overflow-hidden"
                onClick={() => router.push("/notifications")}
              >
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 left-6 flex items-center justify-center h-[14px] w-[14px] text-[10px] bg-red-500 text-white rounded-full">
                    {unreadNotifications > 99 ? "99+" : unreadNotifications}
                  </span>
                )}
                <Bell className="text-zinc-500 dark:text-zinc-400 mr-2 h-4 w-4" />
                <span
                  style={{ opacity: isSidebarOpen ? "100" : "0" }}
                  className={cn(
                    "transition-all duration-300",
                    pathname !== "/notifications" &&
                      "text-zinc-500 dark:text-zinc-400",
                  )}
                >
                  Notifications
                </span>
              </Button>
            </div>
          </div>
        </nav>
        <div className="mt-auto mb-2 p-4 min-h-16 relative">
          <div
            className="flex items-center gap-2"
            // onClick={() => setIsProfileOpen((val) => true)}
          >
            {/* <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      ref={profileRef}
                      className="absolute bottom-14 left-4 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg w-40 z-[5] p-2"
                    >
                      <ul className=" flex flex-col gap-1 items-center w-full ">
                        <li
                          className="cursor-pointer flex items-center rounded-sm bg-neutral-50 hover:bg-neutral-200 dark:bg-neutral-950 p-1 dark:hover:bg-neutral-900 px-2 gap-2 w-full transition-all"
                          onClick={() => router.push("/my-account")}
                        >
                          <User2 size={24} />
                          <button className="text-neutral-700 cursor-pointer dark:text-neutral-200 w-full py-1">
                            My Account
                          </button>
                        </li>

                        <li
                          className="cursor-pointer bg-red-500 hover:bg-red-600 transition-all rounded-sm px-2 flex items-center gap-2 p-1 w-full"
                          onClick={() => alert("LOGOUT")}
                        >
                          <LogOutIcon size={24} color="white" />
                          <button
                            style={{ color: "white" }}
                            className=" text-white cursor-pointer py-1"
                          >
                            Sign Out
                          </button>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence> */}
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={session?.user?.image ?? undefined}
                alt="Avatar"
              />
              <AvatarFallback>
                <User2 size={20} />
              </AvatarFallback>
            </Avatar>
            <div
              style={{ opacity: isSidebarOpen ? "100" : "0" }}
              className="transition-all duration-300"
            >
              <div className="grid gap-0.5 text-xs">
                <div className="font-medium">
                  {session?.user?.name || "User"}
                </div>
                <div className="text-muted-foreground">
                  {session?.user?.email}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 rounded-lg bg-zinc-50 dark:bg-[#0f0f12] shadow-sm shadow-zinc-300 dark:shadow-zinc-950 overflow-hidden">
        {/* <div className="flex-1 rounded-lg bg-zinc-50 dark:bg-[#0f0f12] shadow-sm overflow-auto"> */}
        <AppLayout>{children}</AppLayout>
      </div>
    </div>
    // </SessionProvider>
  );
}
