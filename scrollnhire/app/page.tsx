"use client";
import Earth from "@/components/globe";
import SmoothScrollProvider from "@/components/smooth_scroll_provider";
import { AnimatedUnderline } from "@/components/ui/animated-underline";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronRight, Moon, Sun, User2 } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
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
    <SmoothScrollProvider>
      <div className="h-full w-full">
        {/* NAVBAR */}
        <div className="w-full h-fit top-0 left-0 flex items-center justify-center fixed z-10 p-4">
          <div className="w-full max-w-3xl flex items-center justify-between border p-2 rounded-2xl bg-background backdrop-blur-md shadow-sm">
            {/*  */}
            <div className="ml-[6px]">
              {/* ScrollnHire */}

              <Image
                src="/logo_white.svg"
                height={60}
                width={60}
                alt="gradient"
                className="hidden dark:block h-6 w-6"
              />
              <Image
                src="/logo_black.svg"
                height={60}
                width={60}
                alt="gradient"
                className="dark:hidden block h-6 w-6"
              />
            </div>

            <div className="flex h-full items-center gap-16">
              <div className="h-full flex gap-4 items-center">
                <AnimatedUnderline text="FAQ" link="/" />
                <AnimatedUnderline text="Features" link="/features" />
                <AnimatedUnderline text="Pricing" link="/pricing" />
              </div>

              <div className="flex gap-2 items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="rounded-xl"
                >
                  {theme === "dark" ? (
                    <Sun className="size-[18px]" />
                  ) : (
                    <Moon className="size-[18px]" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>
                <Link
                  href="/login"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Button variant="outline" className="rounded-xl text-xs py-4">
                    Login
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="rounded-xl text-xs py-4">
                    Get Started
                    <ChevronRight className="ml-1 size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* HERO */}
        <div className="h-svh text-7xl sm:h-[50vh] bg-white dark:bg-black w-full flex flex-col items-center justify-end">
          <div className=" font-medium flex flex-col items-center justify-end">
            <div className="flex gap-4">
              <div className="flex gap-2">
                Scroll{" "}
                <div className="h-full aspect-square border bg-[blueviolet] rounded-xl">
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="h-12 w-12 overflow-hidden relative">
                      {/* DARK MODE */}
                      <Image
                        src="/logo_black.svg"
                        height={60}
                        width={60}
                        alt="gradient"
                        className="animate-scroll1 hidden absolute top-0 left-1/2 -translate-x-1/2 dark:block h-12 w-12"
                      />
                      <Image
                        src="/logo_black.svg"
                        height={60}
                        width={60}
                        alt="gradient"
                        className="animate-scroll2 absolute top-full left-1/2 -translate-x-1/2 hidden dark:block h-12 w-12"
                      />
                      {/* LIGHT MODE */}
                      <Image
                        src="/logo_white.svg"
                        height={60}
                        width={60}
                        alt="gradient"
                        className="animate-scroll1 block absolute top-0 left-1/2 -translate-x-1/2 dark:hidden h-12 w-12"
                      />
                      <Image
                        src="/logo_white.svg"
                        height={60}
                        width={60}
                        alt="gradient"
                        className="animate-scroll2 absolute top-full left-1/2 -translate-x-1/2 block dark:hidden h-12 w-12"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                Discover
                {/* <div className="w-36 h-full bg-transparent relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 aspect-2/3 w-19 rounded-lg shadow-sm shadow-blue-700 dark:shadow-blue-950 border border-blue-800 -rotate-30 bg-blue-700 flex flex-col items-center gap-2 p-2">
                    <Avatar className="h-8 w-8 bg-blue-100 dark:bg-blue-100 text-blue-600 dark:text-blue-600">
                      <AvatarImage src={"/placeholder.png"} alt="Avatar" />
                      <AvatarFallback className="bg-blue-100 dark:bg-blue-100 text-blue-600 dark:text-blue-600">
                        <User2 size={20} />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col w-full h-fit">
                      <span className="font-semibold text-blue-100 text-sm">
                        Andrew
                      </span>
                      <span className="font-light text-xs text-blue-300">
                        Software Engineer
                      </span>
                    </div>
                  </div>
                  
                  <div className="absolute top-1/2 -translate-y-1/2 right-0 aspect-2/3 w-19 rounded-lg shadow-sm border border-blue-900 rotate-30 bg-blue-800 shadow-blue-800 dark:shadow-blue-950 flex flex-col items-center gap-2 p-2">
                    <Avatar className="h-8 w-8 bg-blue-100 dark:bg-blue-100 text-blue-600 dark:text-blue-600">
                      <AvatarImage src={"/placeholder.png"} alt="Avatar" />
                      <AvatarFallback className="bg-blue-100 dark:bg-blue-100 text-blue-600 dark:text-blue-600">
                        <User2 size={20} />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col w-full h-fit">
                      <span className="font-semibold text-blue-100 text-sm">
                        John
                      </span>
                      <span className="font-light text-xs text-blue-300">
                        Senior Developer
                      </span>
                    </div>
                  </div>
                </div> */}
                <div className="h-full w-fit">
                  <Earth />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              Hire
              <div className="w-36 h-full border rounded-xl bg-foreground"></div>
            </div>
          </div>
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
          className="block dark:hidden h-auto w-screen"
        />
        <Image
          src="/landing/dark_to_light_gradient.svg"
          height={1000}
          width={2000}
          alt="gradient"
          className="hidden dark:block h-auto w-screen"
        />
        <div className="h-screen bg-black dark:bg-white"></div>
      </div>
    </SmoothScrollProvider>
  );
};

export default LandingPage;
