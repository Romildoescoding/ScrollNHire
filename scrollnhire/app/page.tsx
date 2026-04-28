"use client";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const LandingPage = () => {
  const { theme, setTheme } = useTheme();
  //   const [mounted, setMounted] = useState(false);

  //   useEffect(() => {
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
  //   }, []);

  const toggleTheme = () => {
    setTheme((theme) => (theme === "dark" ? "light" : "dark"));
  };

  return (
    <div className="h-full w-full">
      {/* HERO */}
      <div className="h-svh sm:h-[50vh] bg-white w-full">
        ScrollnHire
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {theme === "dark" ? (
            <Sun className="size-[18px]" />
          ) : (
            <Moon className="size-[18px]" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      {/* U shape light to dark */}
      {/* <Image
        src="/landing/dark_to_light_gradient_rotated.svg"
        height={1000}
        width={2000}
        alt="gradient"
        className="h-auto w-screen"
      /> */}

      {/* U shape light to dark */}
      <Image
        src="/landing/light_to_dark_gradient.png"
        height={1000}
        width={2000}
        alt="gradient"
        className="h-auto w-screen"
      />
      <div className="h-screen bg-black"></div>
    </div>
  );
};

export default LandingPage;
