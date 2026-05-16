/////////////////////////////////////////////////

// THIS IS THE NAVBAR USED IN THE MAIN APPLICATION NOT THE AUTH ROUTES...

/////////////////////////////////////////////////

"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Gem,
  LogOut,
  Mail,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  User2,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useSidebar } from "@/app/context/SidebarContext";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  //   const [isMenuOpen, setIsMenuOpen] = useState(false);
  //   const router = useRouter();

  //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  // const [mounted, setMounted] = useState(false);
  //   const [isScrolled, setIsScrolled] = useState(false);

  // useEffect(() => {
  // setMounted(true);
  // const handleScroll = () => {
  //   if (window.scrollY > 10) {
  //     setIsScrolled(true);
  //   } else {
  //     setIsScrolled(false);
  //   }
  // };

  // window.addEventListener("scroll", handleScroll);
  // return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  const toggleTheme = () => {
    setTheme((theme) => (theme === "dark" ? "light" : "dark"));
  };

  // const router = useRouter();
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const router = useRouter();

  async function handleLogout() {
    // signOut({ callbackUrl: "https://localhost:3000/login" });
    await signOut({ redirect: false });
    router.push("/login");
  }

  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav
      className={cn(
        "border-b z-[9] transition-all bg-zinc-100 dark:bg-zinc-900 duration-500 fixed top-0 right-0 md:top-2 md:right-2 h-[56px]",
        pathname.startsWith("/reels") && !session?.user?.email
          ? "w-[100vw]"
          : isSidebarOpen
            ? "w-[100vw] md:w-[calc(100vw-264px)]"
            : "w-[100vw] md:w-[calc(100vw-88px)]",
      )}
    >
      <div className="flex justify-between pr-4 dark:bg-neutral-950 transition-all duration-500 h-full w-full md:rounded-t-lg bg-white">
        <button
          onClick={() => setIsSidebarOpen((open) => !open)}
          disabled={pathname.startsWith("/reels") && !session?.user?.email}
          className={cn(
            "z-[11] h-14 w-18 flex items-center justify-center cursor-pointer transition-all duration-500 text-neutral-600 hover:text-neutral-950 dark:text-white dark:hover:text-neutral-200",
            isSidebarOpen ? " md:text-neutral-600" : " text-neutral-600",
          )}
        >
          {/* <PanelLeftOpen size={20} /> */}
          {isSidebarOpen ? (
            <PanelLeftClose size={20} />
          ) : (
            <PanelLeftOpen size={20} />
          )}
        </button>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="rounded-full"
          >
            <LogOut className="size-[18px]" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {/* {mounted && ( */}
            {theme === "dark" ? (
              <Sun className="size-[18px]" />
            ) : (
              <Moon className="size-[18px]" />
            )}
            {/* )} */}
          </Button>
          {/* <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          it is for the mobile version of the application
          {mobileMenuOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
          <span className="sr-only">Toggle menu</span>
        </Button> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
