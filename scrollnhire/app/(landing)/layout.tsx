"use client";
import SmoothScrollProvider from "@/components/smooth_scroll_provider";
import { AnimatedUnderline } from "@/components/ui/animated-underline";
import { Button } from "@/components/ui/button";
import { ChevronRight, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function LandingLayout({ children }: { children: React.ReactNode }) {
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
      {/* NAVBAR */}
      <div className="w-full h-fit top-0 left-0 flex items-center justify-center fixed z-10 p-4">
        <div className="w-full max-w-3xl flex items-center justify-between border p-2 rounded-2xl bg-background backdrop-blur-md shadow-sm">
          {/*  */}
          <Link href="/" className="ml-[6px]">
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
          </Link>

          <div className="flex h-full items-center gap-16">
            <div className="h-full hidden min-[600px]:flex gap-4 items-center">
              <AnimatedUnderline text="FAQ" link="/#faq" />
              <AnimatedUnderline text="Features" link="/#features" />
              <AnimatedUnderline text="Pricing" link="/#pricing" />
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
              <Link href="/signup">
                <Button className="rounded-xl text-xs py-4">
                  Get Started
                  <ChevronRight className="ml-1 size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {children}
      <div className="h-fit bg-white dark:bg-black flex flex-col">
        <footer className="w-full">
          <div className="container flex flex-col gap-8 px-4 py-10 pb-0 md:px-6 lg:py-16 lg:pb-0">
            <div className="flex gap-8 justify-between">
              <div className="space-y-4">
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
                <p className="text-sm text-muted-foreground">
                  {`Everything you need to hire, nothing you don't.`}
                </p>
              </div>
              <div className="grid w-fit gap-8 grid-cols-2">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold">Product</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link
                        href="/#features"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Features
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/#pricing"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Pricing
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/#faq"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        FAQ
                      </Link>
                    </li>
                    {/* <li>
                      <Link
                        href="#"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        API
                      </Link>
                    </li> */}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-bold">Company</h4>
                  <ul className="space-y-2 text-sm">
                    {/* <li>
                      <Link
                        href="#"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        About
                      </Link>
                    </li> */}
                    <li>
                      <Link
                        href="/careers"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Careers
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/privacy-policy"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/terms-and-conditions"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Terms of Service
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="text-[18vw] h-[20vw] font-semibold">
              ScrollnHire
            </div>
            <div className="flex flex-col gap-4 sm:flex-row justify-between items-center border-t border-border/40 pt-8">
              <p className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} ScrollnHire. All rights
                reserved.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/privacy-policy"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-and-conditions"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
                {/* <Link
                  href="#"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cookie Policy
                </Link> */}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </SmoothScrollProvider>
  );
}

export default LandingLayout;
