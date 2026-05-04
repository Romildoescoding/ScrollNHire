"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Pricing } from "@/components/pricing";
import FAQ from "@/components/faq";

const LandingPage = () => {
  const router = useRouter();
  const ref = useRef(null);

  const isInView = useInView(ref, {
    margin: "-20% 0px -20% 0px", // 👈 triggers near center
    once: true,
  });

  const [activeCard, setActiveCard] = useState(0);
  const [progress, setProgress] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      if (!mountedRef.current) return;

      setProgress((prev) => {
        if (prev >= 100) {
          if (mountedRef.current) {
            setActiveCard((current) => (current + 1) % 3);
          }
          return 0;
        }
        return prev + 2; // 2% every 100ms = 5 seconds total
      });
    }, 100);

    return () => {
      clearInterval(progressInterval);
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleCardClick = (index: number) => {
    if (!mountedRef.current) return;
    setActiveCard(index);
    setProgress(0);
  };

  return (
    <div className=" bg-white dark:bg-black pt-44 lg:pt-[216px] pb-8 sm:pb-12 md:pb-16 flex flex-col justify-start items-center lg:px-0 w-full sm:pl-0 sm:pr-0 pl-0 pr-0 max-w-screen overflow-x-hidden overflow-y-auto">
      <div className="w-full max-w-[937px] lg:w-[937px] flex flex-col justify-center items-center gap-3 sm:gap-4">
        <div className="self-stretch  rounded-[3px] flex flex-col justify-center items-center gap-2">
          <div className=" w-full font-sans  max-w-fit text-center flex justify-center flex-col text-[24px] xs:text-[28px] sm:text-[36px] md:text-[52px] lg:text-[80px] font-medium lg:leading-24 px-2 sm:px-4 md:px-0">
            <span className="leading-[1.1] sm:leading-[1.15] md:leading-[1.2] lg:leading-[50px]">
              Hiring and Discovery,
            </span>
            <h1 className="font-playfair text-slate-900 dark:text-slate-100 italic leading-tight mb-2">
              Reimagined
            </h1>
            {/* <br /> */}
          </div>
          <div className=" w-full max-w-fit text-center text-muted-foreground flex justify-center flex-col sm:text-lg md:text-xl leading-[1.4] sm:leading-[1.45] md:leading-[1.5] lg:leading-7 font-sans px-2 sm:px-4 md:px-0 lg:text-lg font-medium text-sm">
            Scroll through real people, real work, and real opportunities —
            <br className="hidden sm:block" />
            all in one intuitive platform designed for hiring and getting hired.
          </div>
        </div>
      </div>

      <div className="w-full max-w-[497px] lg:w-[497px] flex flex-col justify-center items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 relative mt-6">
        <div className="h-fit px-6 sm:px-8 md:px-10 lg:px-12 py-2 sm:py-[6px] relative rounded-full flex gap-4 justify-center items-center">
          <Button
            variant="outline"
            className="z-5 rounded-full text-base sm:text-lg md:text-xl px-5 py-2 sm:px-10 sm:py-5 md:px-10 md:py-7 font-medium"
            onClick={() => router.push("/reels")}
          >
            Discover Talent
          </Button>
          <Button
            variant="default"
            className="z-5 rounded-full text-base sm:text-lg md:text-xl px-5 py-2 sm:px-10 sm:py-5 md:px-10 md:py-7 font-medium"
            onClick={() => router.push("/login")}
          >
            Hire now
          </Button>
        </div>
      </div>

      <div className="w-full px-8 pt-12 pb-12 sm:px-16 md:px-24 h-fit relative max-w-screen overflow-hidden overflow-y-visible blue_gradient">
        <div className="z-5 relative w-full aspect-video bg-foreground rounded-xl"></div>
        {/* <div className="z-4 absolute top-0 left-1/2 transform -translate-x-1/2 pointer-events-none w-screen h-fit">
          <Image
            src="/landing/light_to_dark_gradient.png"
            height={1000}
            width={2000}
            alt="gradient"
            className="dark:hidden block w-screen h-auto z-4"
          />
          <Image
            src="/landing/dark_to_light_gradient.svg"
            height={1000}
            width={2000}
            alt="gradient"
            className="hidden dark:block w-screen h-auto z-4"
          />
        </div> */}
      </div>

      <div className="w-full bg-black dark:bg-white border-b text-white dark:text-black dark:border-zinc-200 border-zinc-800 flex flex-col justify-center items-center">
        {/* Header Section */}
        <div className="self-stretch px-4 sm:px-6 md:px-8 lg:px-0 w-full  py-8 sm:py-12 md:py-16 border-b dark:border-zinc-200 border-zinc-800 flex justify-center items-center gap-6">
          <div className="w-full px-4 sm:px-6 py-4 sm:py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4 shadow-none">
            <div className="w-fit text-center flex justify-center flex-col text-background text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
              <span className=" leading-6 md:leading-10 lg:leading-normal">
                Built for discovery and
              </span>
              <h1 className="font-playfair italic leading-tight text-center">
                real opportunities
              </h1>
            </div>

            <div className="hidden md:block self-stretch text-center text-muted/60 text-sm sm:text-base font-normal leading-6 sm:leading-7 font-sans">
              Explore talent and projects in a smooth, scroll-first experience
              <br />
              that feels natural, fast, and actually enjoyable.
            </div>
            <div className="block md:hidden self-stretch text-center text-muted/60 text-sm sm:text-base font-normal leading-6 sm:leading-7 font-sans">
              Explore talent and projects in a smooth, scroll-first experience
              that feels natural, fast, and actually enjoyable.
            </div>
          </div>
        </div>

        {/* Bento Grid Content */}
        <div className="self-stretch flex justify-center items-start">
          <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
            {/* Left decorative pattern */}
            {/* <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
              {Array.from({ length: 200 }).map((_, i) => (
                <div
                  key={i}
                  className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                />
              ))}
            </div> */}
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 border-l border-r dark:border-zinc-200 border-zinc-800">
            {/* Top Left - Smart. Simple. Brilliant. */}
            <div className="border-b border-r-0 md:border-r dark:border-zinc-200 border-zinc-800 p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-background text-lg sm:text-xl font-semibold leading-tight font-sans">
                  Show, scroll, get noticed
                </h3>
                <p className="text-muted/60 text-sm md:text-base font-normal leading-relaxed font-sans">
                  An Instagram-style feed for projects lets students showcase
                  real work while employers discover talent in seconds, not
                  hours.
                </p>
              </div>
              <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg flex items-center justify-center overflow-hidden">
                {/* <SmartSimpleBrilliant
                          width="100%"
                          height="100%"
                          theme="light"
                          className="scale-50 sm:scale-65 md:scale-75 lg:scale-90"
                        /> */}
              </div>
            </div>

            {/* Top Right - Your work, in sync */}
            <div className="border-b dark:border-zinc-200 border-zinc-800 p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-background font-semibold leading-tight font-sans text-lg sm:text-xl">
                  Conversations that move things forward
                </h3>
                <p className="text-muted/60 text-sm md:text-base font-normal leading-relaxed font-sans">
                  Chat in real time with instant updates so students and
                  employers stay connected without friction or delays.
                </p>
              </div>
              <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg flex overflow-hidden text-right items-center justify-center">
                {/* <YourWorkInSync
                          width="400"
                          height="250"
                          theme="light"
                          className="scale-60 sm:scale-75 md:scale-90"
                        /> */}
              </div>
            </div>

            {/* Bottom Left - Effortless integration */}
            <div className="border-r-0 md:border-r dark:border-zinc-200 border-zinc-800 p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6 bg-transparent">
              <div className="flex flex-col gap-2">
                <h3 className="text-background text-lg sm:text-xl font-semibold leading-tight font-sans">
                  From chat to interview, instantly
                </h3>
                <p className="text-muted/60 text-sm md:text-base font-normal leading-relaxed font-sans">
                  Schedule interviews directly within conversations and stay on
                  track with smart reminders and a clean calendar view.
                </p>
              </div>
              <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg flex overflow-hidden justify-center items-center relative bg-transparent">
                <div className="w-full h-full flex items-center justify-center bg-transparent">
                  {/* <EffortlessIntegration width={400} height={250} className="max-w-full max-h-full" /> */}
                </div>
                {/* Gradient mask for soft bottom edge */}
                {/* <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#F7F5F3] to-transparent pointer-events-none"></div> */}
              </div>
            </div>

            {/* Bottom Right - Numbers that speak */}
            <div className="p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-background text-lg sm:text-xl font-semibold leading-tight font-sans">
                  Hiring, visualized and simplified
                </h3>
                <p className="text-muted/60 text-sm md:text-base font-normal leading-relaxed font-sans">
                  Manage candidates with intuitive Kanban pipelines that make
                  tracking, sorting, and decision-making feel effortless.
                </p>
              </div>
              <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg flex overflow-hidden items-center justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* <NumbersThatSpeak
                            width="100%"
                            height="100%"
                            theme="light"
                            className="w-full h-full object-contain"
                          /> */}
                </div>
                {/* Gradient mask for soft bottom edge */}
                {/* <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#F7F5F3] to-transparent pointer-events-none"></div> */}
                {/* Fallback content if component doesn't render */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20 hidden">
                  <div className="flex flex-col items-center gap-2 p-4">
                    <div className="w-3/4 h-full bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-sm text-green-600">Growth Rate</div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
            {/* Right decorative pattern */}
            {/* <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
              {Array.from({ length: 200 }).map((_, i) => (
                <div
                  key={i}
                  className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                />
              ))}
            </div> */}
          </div>
        </div>
      </div>

      <Pricing />
      <FAQ />

      {/* CTA SECTION */}
      <section className="w-full flex flex-col gap-4 items-center py-12 md:py-24 h-fit inverted_blue_gradient text-primary-foreground relative">
        {/* <div className="container relative z-9 px-4 md:px-6">
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
        </div> */}
        <div className="w-full flex flex-col justify-center items-center gap-3 sm:gap-4">
          <div className="self-stretch w-full rounded-[3px] flex flex-col justify-center items-center gap-2">
            <div className=" w-full font-sans min-w-fit text-center flex justify-center flex-col text-[24px] xs:text-[28px] sm:text-[36px] md:text-[52px] lg:text-[80px] font-medium lg:leading-24 px-2 sm:px-4 md:px-0">
              <span className="leading-[1.1] sm:leading-[1.15] md:leading-[1.2] lg:leading-[50px]">
                Ready to Find or Become
              </span>
              <h1 className="font-playfair italic leading-tight mb-2">
                the Next Big Hire?
              </h1>
              {/* <br /> */}
            </div>
            <div className=" w-full max-w-fit text-center text-black dark:text-white flex justify-center flex-col sm:text-lg md:text-xl leading-[1.4] sm:leading-[1.45] md:leading-[1.5] lg:leading-7 font-sans px-2 sm:px-4 md:px-0 lg:text-lg font-medium text-sm">
              Showcase real work or discover it. Turn scrolling
              <br className="hidden sm:block" />
              into hiring opportunities.
            </div>
          </div>
        </div>

        <div className="w-fit flex flex-col justify-center items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 relative mt-6">
          <div className="h-fit sm:px-8 md:px-10 lg:px-12 py-2 sm:py-[6px] relative rounded-full flex gap-4 justify-center items-center">
            <Button
              variant="default"
              className="z-5 invert-100 rounded-full text-base sm:text-lg md:text-xl px-5 py-2 sm:px-10 sm:py-5 md:px-10 md:py-7 font-medium"
              onClick={() => router.push("/login")}
            >
              Showcase Talent
            </Button>
            <Button
              variant="default"
              className="z-5 rounded-full text-base sm:text-lg md:text-xl px-5 py-2 sm:px-10 sm:py-5 md:px-10 md:py-7 font-medium"
              onClick={() => router.push("/login")}
            >
              Start Hiring
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      {/* <Image
        src="/landing/light_to_dark_gradient_rotated.svg"
        height={1000}
        width={2000}
        alt="gradient"
        className="block dark:hidden h-auto w-screen"
      />
      <Image
        src="/landing/dark_to_light_gradient_rotated.svg"
        height={1000}
        width={2000}
        alt="gradient"
        className="hidden dark:block h-auto w-screen relative"
      /> */}

      {/* <div className="h-fit px-8 pt-12 sm:px-16 py-12 w-full bg-black dark:bg-white flex flex-col md:flex-row justify-center items-stretch gap-0">
       
        <FeatureCard
          title="Plan your schedules"
          description="Streamline customer subscriptions and billing with automated scheduling tools."
          isActive={activeCard === 0}
          progress={activeCard === 0 ? progress : 0}
          onClick={() => handleCardClick(0)}
        />
        <FeatureCard
          title="Analytics & insights"
          description="Transform your business data into actionable insights with real-time analytics."
          isActive={activeCard === 1}
          progress={activeCard === 1 ? progress : 0}
          onClick={() => handleCardClick(1)}
        />
        <FeatureCard
          title="Collaborate seamlessly"
          description="Keep your team aligned with shared dashboards and collaborative workflows."
          isActive={activeCard === 2}
          progress={activeCard === 2 ? progress : 0}
          onClick={() => handleCardClick(2)}
        />
      </div> */}

      {/* <div className="h-fit w-full py-24 text-6xl min-[860px]:text-7xl min-[1140px]:text-8xl font-semibold bg-black text-white dark:bg-white dark:text-black flex flex-col items-center justify-end">
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
      </div> */}
    </div>
  );
};

// function FeatureCard({
//   title,
//   description,
//   isActive,
//   progress,
//   onClick,
// }: {
//   title: string;
//   description: string;
//   isActive: boolean;
//   progress: number;
//   onClick: () => void;
// }) {
//   return (
//     <div
//       className={`w-full md:flex-1 self-stretch px-6 py-5 overflow-hidden flex flex-col justify-start items-start gap-2 cursor-pointer relative border-b md:border-b-0 last:border-b-0 bg-black dark:bg-white ${
//         isActive
//           ? " shadow-[0px_0px_0px_0.75px_#E0DEDB_inset]"
//           : " border-l-0 border-r-0 md:border border-[#E0DEDB]/80"
//       }`}
//       onClick={onClick}
//     >
//       {isActive && (
//         <div className="absolute top-0 left-0 w-full h-0.5 bg-[rgba(50,45,43,0.08)]">
//           <div
//             className="h-full bg-[#322D2B] transition-all duration-100 ease-linear"
//             style={{ width: `${progress}%` }}
//           />
//         </div>
//       )}

//       <div className="self-stretch flex justify-center flex-col text-[#49423D] text-sm md:text-lg font-semibold leading-6 md:leading-6 font-sans">
//         {title}
//       </div>
//       <div className="self-stretch text-muted/60 text-[13px] md:text-[13px] font-normal leading-[22px] md:leading-[22px] font-sans">
//         {description}
//       </div>
//     </div>
//   );
// }

export default LandingPage;
