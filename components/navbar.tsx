/////////////////////////////////////////////////

// THIS IS THE NAVBAR USED IN THE MAIN APPLICATION NOT THE AUTH ROUTES...

/////////////////////////////////////////////////

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Gem, LogOut, Mail, Menu, Moon, Sun, User2, X } from "lucide-react";
import { useTheme } from "next-themes";

const Navbar = () => {
  //   const [isMenuOpen, setIsMenuOpen] = useState(false);
  //   const router = useRouter();

  //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  //   const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    // const handleScroll = () => {
    //   if (window.scrollY > 10) {
    //     setIsScrolled(true);
    //   } else {
    //     setIsScrolled(false);
    //   }
    // };

    // window.addEventListener("scroll", handleScroll);
    // return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const router = useRouter();

  return (
    <nav className="border-b z-[9] fixed top-0 right-0 border-neutral-200 bg-white h-[56px] dark:border-neutral-700 dark:bg-neutral-950 w-full justify-end px-4 min-[1680px]:justify-center flex">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/login")}
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
          {mounted && theme === "dark" ? (
            <Sun className="size-[18px]" />
          ) : (
            <Moon className="size-[18px]" />
          )}
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
    </nav>
  );
};

export default Navbar;
