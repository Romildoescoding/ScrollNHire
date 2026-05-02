"use client";
import { DashboardShowcase } from "@/components/dashboard-landing";
import { FAQ } from "@/components/faqs";
import Earth from "@/components/globe";
import HowItWorks from "@/components/how-it-works";
import { Pricing } from "@/components/pricing";
import SmoothScrollProvider from "@/components/smooth_scroll_provider";
import { AnimatedUnderline } from "@/components/ui/animated-underline";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Moon,
  Sun,
  User2,
} from "lucide-react";
import { useInView, motion } from "motion/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const LandingPage = () => {
  // const { theme, setTheme } = useTheme();
  // //   const [mounted, setMounted] = useState(false);

  // //   useEffect(() => {
  // // setMounted(true);
  // // const handleScroll = () => {
  // //   if (window.scrollY > 10) {
  // //     setIsScrolled(true);
  // //   } else {
  // //     setIsScrolled(false);
  // //   }
  // // };

  // // window.addEventListener("scroll", handleScroll);
  // // return () => window.removeEventListener("scroll", handleScroll);
  // //   }, []);

  // const toggleTheme = () => {
  //   setTheme((theme) => (theme === "dark" ? "light" : "dark"));
  // };

  const ref = useRef(null);

  const isInView = useInView(ref, {
    margin: "-20% 0px -20% 0px", // 👈 triggers near center
    once: true,
  });
  const router = useRouter();

  const [innerWidth, setInnerWidth] = useState(1200);
  useEffect(() => {
    const handleResize = () => {
      setInnerWidth(window.innerWidth);
    };

    // set initial value
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="h-full w-full">
      {/* HERO */}
      <div className="h-[30svh] relative text-3xl sm:text-6xl md:text-7xl sm:h-[30vh] bg-white dark:bg-black w-full flex flex-col items-center justify-end">
        <div className="relative top-40 flex flex-col gap-4 items-center">
          <div className="relative font-medium flex flex-col items-center justify-end">
            <div className="flex gap-4">
              <div className="flex gap-2">
                Scroll{" "}
                <div className="h-full aspect-square border bg-[blueviolet] rounded-xl">
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="h-8 w-8 sm:h-12 sm:w-12 overflow-hidden relative">
                      {/* DARK MODE */}
                      <Image
                        src="/logo_black.svg"
                        height={60}
                        width={60}
                        alt="gradient"
                        className="animate-scroll1 hidden absolute top-0 left-1/2 -translate-x-1/2 dark:block h-8 w-8 sm:h-12 sm:w-12"
                      />
                      <Image
                        src="/logo_black.svg"
                        height={60}
                        width={60}
                        alt="gradient"
                        className="animate-scroll2 absolute top-full left-1/2 -translate-x-1/2 hidden dark:block h-8 w-8 sm:h-12 sm:w-12"
                      />
                      {/* LIGHT MODE */}
                      <Image
                        src="/logo_white.svg"
                        height={60}
                        width={60}
                        alt="gradient"
                        className="animate-scroll1 block absolute top-0 left-1/2 -translate-x-1/2 dark:hidden h-8 w-8 sm:h-12 sm:w-12"
                      />
                      <Image
                        src="/logo_white.svg"
                        height={60}
                        width={60}
                        alt="gradient"
                        className="animate-scroll2 absolute top-full left-1/2 -translate-x-1/2 block dark:hidden h-8 w-8 sm:h-12 sm:w-12"
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
                  <Earth size={innerWidth > 640 ? 72 : 54} />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              Hire
              <div className="w-56 flex items-center justify-center h-full  bg-foreground rounded-2xl">
                <div className="w-52 h-[54px] overflow-hidden relative">
                  <div className="animate-hire-1 absolute top-full left-1/2 w-52 h-[54px] -translate-x-1/2 border p-2 flex gap-2 bg-background rounded-xl">
                    <Avatar className="h-8 w-8 ">
                      <AvatarImage src={"/placeholder.png"} alt="Avatar" />
                      <AvatarFallback className="">
                        <User2 size={20} />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col w-full h-fit">
                      <span className="font-semibold  text-sm">Andrew</span>
                      <span className="font-light text-xs">
                        Software Engineer
                      </span>
                    </div>
                    <div className="h-full w-fit flex items-center justify-center">
                      <div className="animate-selection-div1 h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                        <Check />
                      </div>
                    </div>
                  </div>
                  <div className="animate-hire-2 absolute top-1/2 left-1/2 w-52 h-[54px] -translate-x-1/2 border p-2 flex gap-2 bg-background rounded-xl">
                    <Avatar className="h-8 w-8 ">
                      <AvatarImage src={"/placeholder.png"} alt="Avatar" />
                      <AvatarFallback className="">
                        <User2 size={20} />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col w-full h-fit">
                      <span className="font-semibold  text-sm">John</span>
                      <span className="font-light text-xs">
                        Product Manager
                      </span>
                    </div>
                    <div className="h-full w-fit flex items-center justify-center">
                      <div className="animate-selection-div2 h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                        <Check />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="absolute top-full left-1/2 -translate-x-1/2 ">
            <div className="text-xl text-muted-foreground text-center flex flex-col">
              <span>
                Find developers through their work, not their resumes.
              </span>
              <span>
                A feed of real projects, live demos, and actual skills.
              </span>
            </div>
          </div> */}
        <div className="absolute top-[200%] left-1/2 -translate-x-1/2 rounded-xl h-fit w-[90vw] p-4 flex flex-col gap-4">
          <div className="flex w-full justify-between gap-4">
            <Button
              className="rounded-full text-base sm:text-lg md:text-xl font-medium"
              style={{
                padding:
                  innerWidth >= 768
                    ? "30px 60px"
                    : innerWidth >= 640
                      ? "20px 40px"
                      : "10px 20px",
              }}
              onClick={() => router.push("/reels")}
            >
              Explore Talent
            </Button>
            <Button
              variant="secondary"
              style={{
                padding:
                  innerWidth >= 768
                    ? "30px 60px"
                    : innerWidth >= 640
                      ? "20px 40px"
                      : "10px 20px",
              }}
              className="rounded-full text-base sm:text-lg md:text-xl dark:bg-zinc-950 font-medium"
              onClick={() => router.push("/login")}
            >
              Hire now
            </Button>
          </div>
          <div className=" rounded-xl w-full aspect-video bg-black shadow-sm"></div>
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
      <div className="h-[100vh] min-[860px]:h-[125vh] min-[1440px]:h-[150vh] text-6xl min-[860px]:text-7xl min-[1140px]:text-8xl font-bold pb-[30vh] bg-black text-white dark:bg-white dark:text-black flex flex-col items-center justify-end">
        <div className="h-fit w-full flex flex-col items-center" ref={ref}>
          <motion.div className=" overflow-hidden">
            <motion.div
              className=""
              animate={{
                y: isInView ? 0 : "100%",
              }}
              transition={{ duration: 1.5, ease: "anticipate" }}
            >
              Spot real talent.
            </motion.div>
          </motion.div>
          <motion.div className=" overflow-hidden">
            <motion.div
              className=""
              animate={{
                y: isInView ? 0 : "100%",
              }}
              transition={{ delay: 0.125, duration: 1.5, ease: "anticipate" }}
            >
              Engage without friction.
            </motion.div>
          </motion.div>
          <motion.div className=" overflow-hidden">
            <motion.div
              className=""
              animate={{
                y: isInView ? 0 : "100%",
              }}
              transition={{ delay: 0.25, duration: 1.5, ease: "anticipate" }}
            >
              Hire with clarity.
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* SEPARATE COMPONENTS */}
      <HowItWorks />
      <DashboardShowcase />
      <Pricing />
      <FAQ />

      {/* CTA SECTION */}
      <section className="w-full h-0 bg-black dark:bg-white text-primary-foreground relative">
        <div className="container top-64 relative z-9 px-4 md:px-6">
          <motion.div
            // initial={{ opacity: 0, y: 20 }}
            // whileInView={{ opacity: 1, y: 0 }}
            // viewport={{ once: true }}
            // transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-6 text-center"
          >
            <h2 className="text-3xl md:text-6xl lg:text-5xl font-bold tracking-tight">
              Ready to Find or Become the Next Big Hire?
            </h2>

            <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
              Showcase real work or discover it. Turn scrolling into hiring
              opportunities.
            </p>

            <div className="flex flex-col sm:flex-row gap-12 mt-4">
              <Button
                className="rounded-full text-xl font-medium"
                style={{ padding: "30px 60px" }}
                onClick={() => router.push("/login")}
              >
                Showcase Talent
              </Button>
              <Button
                variant="secondary"
                style={{ padding: "30px 60px" }}
                className="rounded-full text-xl dark:bg-zinc-950 font-medium"
                onClick={() => router.push("/login")}
              >
                Start Recruiting
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <Image
        src="/landing/light_to_dark_gradient_rotated.svg"
        height={1000}
        width={2000}
        alt="gradient"
        className="block dark:hidden h-auto w-screen relative bottom-[50%]"
      />
      <Image
        src="/landing/dark_to_light_gradient_rotated.svg"
        height={1000}
        width={2000}
        alt="gradient"
        className="hidden dark:block h-auto w-screen relative bottom-[50%]"
      />
    </div>
  );
};

export default LandingPage;
