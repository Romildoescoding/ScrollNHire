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

export default function Layout({ children }: { children: React.ReactNode }) {
  // const [hideLayout, setHideLayout] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
    fetchUnreadNotifications();
    setRole(user.role);
  }, [pathname]);

  const { uploadProgress } = useUploadProgress();

  return (
    // <SessionProvider>
    <div className="flex min-h-[calc(100vh-56px)]">
      <button
        onClick={() => setIsSidebarOpen((open) => !open)}
        className={cn(
          "z-[11] h-14 w-18 flex items-center justify-center cursor-pointer transition-all duration-500 text-neutral-600 hover:text-neutral-950 border-b border-r bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-700 dark:text-white dark:hover:text-neutral-200 absolute left-68 top-0",
          isSidebarOpen
            ? "left-40 md:left-[184px] md:text-neutral-600"
            : "left-4 md:left-[0px] text-neutral-600",
        )}
        style={{ position: "fixed" }}
      >
        {isSidebarOpen ? (
          <PanelLeftClose size={20} />
        ) : (
          <PanelLeftOpen size={20} />
        )}
      </button>

      {/* {uploadProgress > -1 && ( */}

      <motion.div
        style={{ top: uploadProgress > -1 ? "56px" : "-32px" }}
        className="w-full transition-all duration-500 bg-transparent fixed top-14 right-0 h-8 flex z-50"
      >
        <div
          className={cn(
            "h-full transition-all duration-500",
            isSidebarOpen ? "w-[192px] md:w-[256px]" : "w-[0px] md:w-[72px]",
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
          "fixed z-[10] max-h-screen min-h-screen left-0 top-0 h-full bg-white dark:bg-neutral-950 flex flex-col border-r md:flex md:relative transition-all duration-500 overflow-hidden",
          isSidebarOpen ? "w-48 md:w-64" : "w-0 md:w-[72px]",
        )}
        style={{ position: "sticky" }}
      >
        <div className="flex h-14 min-h-14 min-w-fit overflow-hidden items-center border-b px-4"></div>
        <div className="bg-white dark:bg-neutral-950 fixed top-0 left-0 flex h-14 min-h-14 min-w-fit overflow-hidden items-center border-b dark:border-neutral-700 px-4 z-[5] w-[250px]">
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 100 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  href="/"
                  className="flex items-center gap-2 font-semibold"
                >
                  <div className="h-fit min-w-fit">ScrollnHire</div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <nav
          className="flex-1 overflow-x-hidden overflow-y-auto py-4"
          style={{ overflowY: isSidebarOpen ? "auto" : "hidden" }}
        >
          {/* MAIN FEATURES */}
          <div className="px-4 py-2 flex flex-col gap-1">
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
                variant={pathname === "/dashboard" ? "secondary" : "ghost"}
                className="w-full pl-2 cursor-pointer justify-start overflow-hidden"
                onClick={() => router.push("/dashboard")}
              >
                <Home className="text-neutral-500 mr-2" />
                <span
                  style={{ opacity: isSidebarOpen ? "100" : "0" }}
                  className="transition-all duration-300"
                >
                  Home
                </span>
              </Button>

              <Button
                variant={pathname === "/jobs" ? "secondary" : "ghost"}
                className="w-full pl-2 cursor-pointer justify-start overflow-hidden"
                onClick={() => router.push("/jobs")}
              >
                <BriefcaseBusiness className="text-neutral-500 mr-2 h-4 w-4" />
                <span
                  style={{ opacity: isSidebarOpen ? "100" : "0" }}
                  className="transition-all duration-300"
                >
                  Job Profiles
                </span>
              </Button>
              <Button
                variant={pathname === "/profile" ? "secondary" : "ghost"}
                className="w-full pl-2 cursor-pointer justify-start overflow-hidden"
                onClick={() => router.push("/profile")}
              >
                <User2 className="text-neutral-500 mr-2 h-4 w-4" />
                <span
                  style={{ opacity: isSidebarOpen ? "100" : "0" }}
                  className="transition-all duration-300"
                >
                  My Profile
                </span>
              </Button>

              <Button
                variant={pathname === "/interviews" ? "secondary" : "ghost"}
                className="w-full pl-2 cursor-pointer justify-start overflow-hidden"
                onClick={() => router.push("/interviews")}
              >
                <Laptop className="text-neutral-500 mr-2 h-4 w-4" />
                <span
                  style={{ opacity: isSidebarOpen ? "100" : "0" }}
                  className="transition-all duration-300"
                >
                  Interviews
                </span>
              </Button>

              <Button
                variant={pathname === "/reels" ? "secondary" : "ghost"}
                className="w-full pl-2 cursor-pointer justify-start overflow-hidden"
                onClick={() => router.push("/reels")}
              >
                <SquarePlay className="text-neutral-500 mr-2 h-4 w-4" />
                <span
                  style={{ opacity: isSidebarOpen ? "100" : "0" }}
                  className="transition-all duration-300"
                >
                  Reels
                </span>
              </Button>

              <Button
                variant={pathname === "/explore" ? "secondary" : "ghost"}
                className="w-full pl-2 cursor-pointer justify-start overflow-hidden"
                onClick={() => router.push("/explore")}
              >
                <Compass className="text-neutral-500 mr-2 h-4 w-4" />
                <span
                  style={{ opacity: isSidebarOpen ? "100" : "0" }}
                  className="transition-all duration-300"
                >
                  Explore
                </span>
              </Button>

              <Button
                variant={pathname === "/create" ? "secondary" : "ghost"}
                className="w-full pl-2 cursor-pointer justify-start overflow-hidden"
                onClick={() => router.push("/create")}
              >
                <Plus className="text-neutral-500 mr-2 h-4 w-4" />
                <span
                  style={{ opacity: isSidebarOpen ? "100" : "0" }}
                  className="transition-all duration-300"
                >
                  Create
                </span>
              </Button>
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
                <Bell className="text-neutral-500 mr-2 h-4 w-4" />
                <span
                  style={{ opacity: isSidebarOpen ? "100" : "0" }}
                  className="transition-all duration-300"
                >
                  Notifications
                </span>
              </Button>
            </div>
          </div>

          {/* CONTACT SECTION */}
          <div className="px-4 py-2 flex flex-col gap-1">
            {/* <h2 className="mb-2 relative px-2 text-xs font-semibold tracking-tight">
              <span
                className="transition-all duration-500"
                style={{ opacity: isSidebarOpen ? "100" : "0" }}
              >
                Configurations
              </span>
              <span
                className="transition-all duration-500 absolute top-0 left-2"
                style={{ opacity: !isSidebarOpen ? "100" : "0" }}
              >
                -----
              </span>
            </h2> */}
            <div className="space-y-1 flex flex-col gap-1">
              {/* <Button
                  variant={pathname === "/lists" ? "secondary" : "ghost"}
                  className="w-full pl-2 cursor-pointer justify-start overflow-hidden"
                  onClick={() => router.push("/lists")}
                >
                  <List className="text-neutral-500 mr-2 h-4 w-4" />
                  <span
                    style={{ opacity: isSidebarOpen ? "100" : "0" }}
                    className="transition-all duration-300"
                  >
                    Lists
                  </span>
                </Button> */}

              {/* <Button
                      variant={
                        pathname === "/growth-center" ? "secondary" : "ghost"
                      }
                      className="w-full pl-2 cursor-pointer justify-start overflow-hidden"
                      onClick={() => router.push("/growth-center")}
                    >
                      <TrendingUp className="text-neutral-500 mr-2 h-4 w-4" />
                      <span
                        style={{ opacity: isSidebarOpen ? "100" : "0" }}
                        className="transition-all duration-300"
                      >
                        Growth Center
                      </span>
                    </Button> */}
            </div>
          </div>

          {/* MAIBOX SECTION */}
          {/* <div className="px-4 py-2 flex flex-col gap-1">
              <h2 className="mb-2 relative px-2 text-xs font-semibold tracking-tight">
                <span
                  className="transition-all duration-500"
                  style={{ opacity: isSidebarOpen ? "100" : "0" }}
                >
                  Mailbox
                </span>
                <span
                  className="transition-all duration-500 absolute top-0 left-2"
                  style={{ opacity: !isSidebarOpen ? "100" : "0" }}
                >
                  -----
                </span>
              </h2>
              <div className="space-y-1 flex flex-col gap-1">
                <Button
                  variant={pathname === "/mailbox" ? "secondary" : "ghost"}
                  className="w-full pl-2 cursor-pointer justify-start overflow-hidden"
                  onClick={() => router.push("/mailbox")}
                >
                  <Mails className="text-neutral-500 mr-2 h-4 w-4" />
                  <span
                    style={{ opacity: isSidebarOpen ? "100" : "0" }}
                    className="transition-all duration-300"
                  >
                    Mailboxes
                  </span>
                </Button>

                <Button
                  variant={pathname === "/mail/compose" ? "secondary" : "ghost"}
                  className="w-full pl-2 cursor-pointer justify-start overflow-hidden"
                  onClick={() => router.push("/mail/compose")}
                >
                  <PlusCircle className="text-neutral-500 mr-2 h-4 w-4" />
                  <span
                    style={{ opacity: isSidebarOpen ? "100" : "0" }}
                    className="transition-all duration-300"
                  >
                    Compose
                  </span>
                </Button>
                <Button
                  variant={pathname === "/mail/drafts" ? "secondary" : "ghost"}
                  className="w-full pl-2 cursor-pointer justify-start overflow-hidden"
                  onClick={() => router.push("/mail/drafts")}
                >
                  <FileText className="text-neutral-500 mr-2 h-4 w-4" />
                  <span
                    style={{ opacity: isSidebarOpen ? "100" : "0" }}
                    className="transition-all duration-300"
                  >
                    Drafts
                  </span>
                </Button>
                <Button
                  variant={pathname === "/mail/sent" ? "secondary" : "ghost"}
                  className="w-full pl-2 cursor-pointer justify-start overflow-hidden"
                  onClick={() => router.push("/mail/sent")}
                >
                  <Send className="text-neutral-500 mr-2 h-4 w-4" />
                  <span
                    style={{ opacity: isSidebarOpen ? "100" : "0" }}
                    className="transition-all duration-300"
                  >
                    Sent
                  </span>
                </Button>
                <Button
                  variant={pathname === "/mail/archive" ? "secondary" : "ghost"}
                  className="w-full pl-2 cursor-pointer justify-start overflow-hidden"
                  onClick={() => router.push("/mail/archive")}
                >
                  <Archive className="text-neutral-500 mr-2 h-4 w-4" />
                  <span
                    style={{ opacity: isSidebarOpen ? "100" : "0" }}
                    className="transition-all duration-300"
                  >
                    Archive
                  </span>
                </Button>
                <Button
                  variant={pathname === "/mail/spam" ? "secondary" : "ghost"}
                  className="w-full pl-2 cursor-pointer justify-start overflow-hidden"
                  onClick={() => router.push("/mail/spam")}
                >
                  <AlertTriangle className="text-neutral-500 mr-2 h-4 w-4" />
                  <span
                    style={{ opacity: isSidebarOpen ? "100" : "0" }}
                    className="transition-all duration-300"
                  >
                    Spam
                  </span>
                </Button>
                <Button
                  variant={pathname === "/mail/deleted" ? "secondary" : "ghost"}
                  className="w-full pl-2 cursor-pointer justify-start overflow-hidden"
                  onClick={() => router.push("/mail/deleted")}
                >
                  <Trash2 className="text-neutral-500 mr-2 h-4 w-4" />
                  <span
                    style={{ opacity: isSidebarOpen ? "100" : "0" }}
                    className="transition-all duration-300"
                  >
                    Deleted Items
                  </span>
                </Button>
              </div>
            </div> */}

          {/* ADMINISTRATION */}
          {/* {true && ( */}
          {/* {isOrgAdmin && (
                  <div className="px-4 py-2 flex flex-col gap-1">
                    <h2 className="mb-2 relative px-2 text-xs font-semibold tracking-tight">
                      <span
                        className="transition-all duration-500"
                        style={{ opacity: isSidebarOpen ? "100" : "0" }}
                      >
                        Organization
                      </span>
                      <span
                        className="transition-all duration-500 absolute top-0 left-2"
                        style={{ opacity: !isSidebarOpen ? "100" : "0" }}
                      >
                        -----
                      </span>
                    </h2>
                    <div className="space-y-1 flex flex-col gap-1">
                      <Button
                        variant={pathname === "/users" ? "secondary" : "ghost"}
                        className="w-full pl-2 cursor-pointer justify-start overflow-hidden"
                        onClick={() => router.push("/users")}
                      >
                        <Users className="text-neutral-500 mr-2 h-4 w-4" />
                        <span
                          style={{ opacity: isSidebarOpen ? "100" : "0" }}
                          className="transition-all duration-300"
                        >
                          Users
                        </span>
                      </Button>
                      <Button
                        variant={
                          pathname === "/departments" ? "secondary" : "ghost"
                        }
                        className="w-full pl-2 cursor-pointer justify-start overflow-hidden"
                        onClick={() => router.push("/departments")}
                      >
                        <Building2 className="text-neutral-500 mr-2 h-4 w-4" />
                        <span
                          style={{ opacity: isSidebarOpen ? "100" : "0" }}
                          className="transition-all duration-300"
                        >
                          Departments
                        </span>
                      </Button>
                    </div>
                  </div>
                )} */}

          {/* DEVELOPER OPTIONS */}
          {/* <div className="px-4 py-2 flex flex-col gap-1">
              <h2 className="mb-2 relative px-2 text-xs font-semibold tracking-tight">
                <span
                  className="transition-all duration-500"
                  style={{ opacity: isSidebarOpen ? "100" : "0" }}
                >
                  Developers
                </span>
                <span
                  className="transition-all duration-500 absolute top-0 left-2"
                  style={{ opacity: !isSidebarOpen ? "100" : "0" }}
                >
                  -----
                </span>
              </h2>
              <div className="space-y-1 flex flex-col gap-1">
                <Button
                  variant={pathname === "/api-keys" ? "secondary" : "ghost"}
                  className="w-full pl-2 cursor-pointer justify-start overflow-hidden"
                  onClick={() => router.push("/api-keys")}
                >
                  <Code2 className="text-neutral-500 mr-2 h-4 w-4" />
                  <span
                    style={{ opacity: isSidebarOpen ? "100" : "0" }}
                    className="transition-all duration-300"
                  >
                    API Keys
                  </span>
                </Button>
              </div>
            </div> */}

          {/* PRICING PLAN */}
          {/* <div className="px-4 py-2 flex flex-col gap-1">
              <h2 className="mb-2 relative px-2 text-xs font-semibold tracking-tight">
                <span
                  className="transition-all duration-500"
                  style={{ opacity: isSidebarOpen ? "100" : "0" }}
                >
                  Pricing
                </span>
                <span
                  className="transition-all duration-500 absolute top-0 left-2"
                  style={{ opacity: !isSidebarOpen ? "100" : "0" }}
                >
                  -----
                </span>
              </h2>
              <div className="space-y-1 flex flex-col gap-1">
                <Button
                  variant={pathname === "/pricing" ? "secondary" : "ghost"}
                  className="w-full pl-2 cursor-pointer justify-start overflow-hidden"
                  onClick={() => router.push("/pricing")}
                >
                  <Banknote className="text-neutral-500 mr-2 h-4 w-4" />
                  <span
                    style={{ opacity: isSidebarOpen ? "100" : "0" }}
                    className="transition-all duration-300"
                  >
                    Pricing Plans
                  </span>
                </Button>
              </div>
            </div> */}
        </nav>
        <div className="mt-auto border-t p-4 relative">
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
      <div className="flex-1 overflow-auto">
        <AppLayout>{children}</AppLayout>
      </div>
    </div>
    // </SessionProvider>
  );
}
