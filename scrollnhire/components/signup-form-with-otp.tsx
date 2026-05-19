"use client";

import type React from "react";

import {
  Eye,
  EyeClosed,
  Loader2,
  Check,
  ArrowRight,
  RefreshCw,
  Mail,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";

import {
  FormEvent,
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  ClipboardEvent,
} from "react";

import { signIn } from "next-auth/react";

import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";

import axios from "axios";

import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { motion, AnimatePresence } from "framer-motion";

export function SignupFormWithOtp({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [loading, setLoading] = useState(false);

  const [loadingEmail, setLoadingEmail] = useState(false);

  const [isVerifying, setIsVerifying] = useState(false);

  const [isVerified, setIsVerified] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [passwordError, setPasswordError] = useState(false);

  const [passwordMatch, setPasswordMatch] = useState(true);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [showPass, setShowPass] = useState(false);

  const [showPassConfirm, setShowPassConfirm] = useState(false);

  // #0000ff
  const [isOtpScreen, setIsOtpScreen] = useState(false);

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));

  const [activeInput, setActiveInput] = useState(0);

  const [timeLeft, setTimeLeft] = useState(30);

  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const searchParams = useSearchParams();

  const router = useRouter();

  // NEXTAUTH ERRORS
  useEffect(() => {
    const err = searchParams.get("error");

    if (err) {
      if (err === "OAuthAccountNotLinked") {
        setErrorMessage("Account exists with different login provider.");
      } else if (err === "CredentialsSignin") {
        setErrorMessage("Invalid email or password.");
      } else {
        setErrorMessage("Login failed. Please try again.");
      }
    }
  }, [searchParams]);

  // OTP TIMER
  useEffect(() => {
    if (timeLeft > 0 && !canResend) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }

    if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  // AUTO FOCUS OTP
  useEffect(() => {
    if (isOtpScreen) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOtpScreen]);

  // GOOGLE LOGIN
  async function handleLoginViaGoogle(e: FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await signIn("google", {
        redirect: false,
        callbackUrl: "/callback",
      });

      setLoading(false);

      if (res?.error) {
        setErrorMessage("Google Sign-in failed.");

        return;
      }

      router.push(res?.url || "/callback");
    } catch (err) {
      setLoading(false);

      setErrorMessage("Something went wrong.");
    }
  }

  // SEND OTP
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setLoadingEmail(true);

    setErrorMessage("");

    setPasswordError(false);

    setPasswordMatch(true);

    if (password.length > 12 || password.length < 6) {
      setPasswordError(true);

      setLoadingEmail(false);

      return;
    }

    if (password !== passwordConfirm) {
      setPasswordMatch(false);

      setLoadingEmail(false);

      return;
    }

    try {
      await axios.post("/api/auth/send-otp", {
        email,
      });

      setIsOtpScreen(true);

      toast.success("OTP sent successfully");

      setLoadingEmail(false);
    } catch (err: any) {
      setLoadingEmail(false);

      if (err.response?.status === 409) {
        setErrorMessage("Account already exists.");

        return;
      }

      setErrorMessage("Failed to send OTP. Please try again.");
    }
  }

  // VERIFY OTP
  async function verifyOtp() {
    if (otp.some((digit) => !digit)) {
      setErrorMessage("Please enter all digits");

      return;
    }

    try {
      setIsVerifying(true);

      setErrorMessage("");

      const enteredOtp = otp.join("");

      await axios.post("/api/auth/verify-otp", {
        email,
        password,
        otp: enteredOtp,
      });

      setIsVerified(true);

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage("Login failed after verification.");

        return;
      }

      setTimeout(() => {
        router.push("/callback");
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Invalid OTP");
    } finally {
      setIsVerifying(false);
    }
  }

  // RESEND OTP
  async function resendOtp() {
    try {
      await axios.post("/api/auth/resend-otp", {
        email,
      });

      setOtp(Array(6).fill(""));

      setCanResend(false);

      setTimeLeft(30);

      setErrorMessage("");

      toast.success("OTP resent successfully");

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      setErrorMessage("Failed to resend OTP");
    }
  }

  // OTP INPUT CHANGE
  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;

    if (value.length > 1 || (value && !/^\d+$/.test(value))) return;

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      setActiveInput(index + 1);

      inputRefs.current[index + 1]?.focus();
    }
  };

  // OTP KEYBOARD
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setActiveInput(index - 1);

      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      setActiveInput(index + 1);

      inputRefs.current[index + 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      setActiveInput(index - 1);

      inputRefs.current[index - 1]?.focus();
    }
  };

  // OTP PASTE
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedData = e.clipboardData.getData("text/plain").trim();

    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    const pastedOtp = pastedData.slice(0, 6).split("");

    const newOtp = [...otp];

    pastedOtp.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });

    setOtp(newOtp);
  };

  // OTP SCREEN
  if (isOtpScreen) {
    return (
      <div
        className={cn("flex items-center justify-center", className)}
        {...props}
      >
        <Card className="w-full max-w-md gap-0 overflow-hidden shadow-none bg-zinc-50 dark:bg-zinc-950 border-none">
          <CardHeader className="space-y-1 p-0">
            <div className="flex flex-col items-center gap-2">
              <a
                href="#"
                className="flex flex-col items-center gap-2 font-medium"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md">
                  {/* <GalleryVerticalEnd className="size-6" /> */}
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
                <span className="sr-only">ScrollnHire.</span>
              </a>
              <h1 className="text-xl font-bold">Welcome to ScrollnHire.</h1>
              {/* <div className="text-center text-sm">
              Please Register to get started
            </div> */}
            </div>

            {!isVerified && (
              <>
                <CardTitle className="text-center text-2xl font-bold">
                  Verification Code
                </CardTitle>

                <CardDescription className="text-center">
                  We&apos;ve sent a 6-digit code to {email}
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="p-0 ">
            <AnimatePresence mode="wait">
              {isVerified ? (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="flex flex-col items-center justify-center py-6 space-y-4"
                >
                  <div className="rounded-full bg-green-100 p-4">
                    <Check className="h-10 w-10 text-green-600" />
                  </div>

                  <div className="text-center">
                    <p className="text-xl font-semibold">
                      Verification Successful
                    </p>

                    <p className="text-muted-foreground mt-2 justify-center items-center flex gap-2">
                      Redirecting
                      <Loader2
                        strokeWidth={2.5}
                        className="h-5 w-5 animate-spin"
                      />
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div className="space-y-6">
                  <div className="flex justify-center space-x-2 sm:space-x-4 my-6">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        className={`h-12 w-10 text-center text-lg font-semibold rounded-lg border-2 transition-all
                          ${
                            activeInput === index
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-zinc-300"
                          }
                          ${digit ? "border-primary" : ""}
                          `}
                      />
                    ))}
                  </div>

                  {errorMessage && (
                    <p className="text-sm text-center text-red-500">
                      {errorMessage}
                    </p>
                  )}

                  {/* <Button
                    onClick={verifyOtp}
                    disabled={isVerifying || otp.some((digit) => !digit)}
                    className="w-full py-6 text-base"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify Code
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button> */}
                  <div className="flex flex-col gap-6 mt-2">
                    <Button
                      onClick={verifyOtp}
                      disabled={isVerifying || otp.some((digit) => !digit)}
                      className="w-full"
                    >
                      Verify
                      {isVerifying ? (
                        <Loader2
                          strokeWidth={2.5}
                          className="h-7 w-7 animate-spin"
                        />
                      ) : (
                        <ArrowRight className="h-7 w-7" />
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          {!isVerified && (
            <CardFooter
              className="flex justify-center border-t mt-4 py-0"
              style={{ paddingTop: "12px" }}
            >
              <div className="text-sm text-center justify-center flex gap-2 w-full">
                {" "}
                <span className="text-muted-foreground">
                  Did not receive the OTP?
                </span>
                {!canResend ? (
                  <span>
                    Resend in <span className="font-medium">{timeLeft}s</span>
                  </span>
                ) : (
                  <button
                    onClick={resendOtp}
                    className="text-primary hover:underline"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    );
  }

  // SIGNUP SCREEN
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleLoginViaGoogle}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                {/* <GalleryVerticalEnd className="size-6" /> */}
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
              <span className="sr-only">ScrollnHire.</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to ScrollnHire.</h1>
            <div className="text-center text-sm">
              Please Register to get started
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full">
              {loading ? (
                <Loader2 strokeWidth={2.5} className="h-7 w-7 animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
              )}
              Continue with Google
            </Button>
          </div>
        </div>
      </form>

      <p className="h-[1px] w-full bg-zinc-300 relative">
        <span className="absolute flex top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-zinc-500 bg-background h-6 w-6 items-center justify-center">
          or
        </span>
      </p>

      {/* ERROR UI */}
      {errorMessage && (
        <p className="text-red-600 dark:text-red-300 bg-[#ffe3e3] dark:bg-[#290000] p-2 rounded-md text-center text-xs">
          {errorMessage}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          {/* email input */}
          <div className="relative w-full mb-2">
            <Input
              type="email"
              id="email"
              placeholder=" "
              className="peer block w-full border border-zinc-400 rounded-lg px-3 py-2 
                 focus:outline-none focus:border-zinc-500 bg-transparent dark:bg-background"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label
              htmlFor="email"
              className="absolute left-3 top-2 px-1 bg-background text-zinc-500 transition-all duration-200
                  peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm 
                  peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-sm
                  peer-focus:-top-2 peer-focus:text-sm peer-focus:text-zinc-600"
            >
              Email
            </label>
          </div>

          {/* password input */}
          <div className="relative w-full">
            <Input
              type={showPass ? "text" : "password"}
              id="password"
              placeholder=" "
              className="peer block w-full border border-zinc-400 rounded-lg px-3 py-2 
                 focus:outline-none focus:border-zinc-500 bg-transparent dark:bg-background"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              variant="ghost"
              type="button"
              className="absolute top-1/2 -translate-y-1/2 right-2 h-6 w-6 text-zinc-500"
              style={{ padding: 0 }}
              onClick={() => setShowPass((show) => !show)}
            >
              {showPass ? <EyeClosed /> : <Eye />}
            </Button>

            <label
              htmlFor="password"
              className="absolute left-3 top-2 px-1 bg-background text-zinc-500 transition-all duration-200
                  peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm 
                  peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-sm
                  peer-focus:-top-2 peer-focus:text-sm peer-focus:text-zinc-600"
            >
              Password
            </label>
          </div>

          {passwordError && (
            <p className="text-red-600 text-xs px-2">
              The password must lie from 6-12 characters in length.
            </p>
          )}
          <div className="relative w-full mt-2">
            <Input
              type={showPassConfirm ? "text" : "password"}
              id="confirm-password"
              placeholder=" "
              className="peer block w-full border border-zinc-400 rounded-lg px-3 py-2 
                 focus:outline-none focus:border-zinc-500 bg-transparent dark:bg-background"
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />

            <Button
              variant="ghost"
              type="button"
              className="absolute top-1/2 -translate-y-1/2 right-2 h-6 w-6 text-zinc-500"
              style={{ padding: 0 }}
              onClick={() => setShowPassConfirm((show) => !show)}
            >
              {showPassConfirm ? <EyeClosed /> : <Eye />}
            </Button>

            <label
              htmlFor="confirm-password"
              className="absolute left-3 top-2 px-1 bg-background text-zinc-500 transition-all duration-200
                  peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm 
                  peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-sm
                  peer-focus:-top-2 peer-focus:text-sm peer-focus:text-zinc-600"
            >
              Confirm Password
            </label>
          </div>
          {!passwordMatch && (
            <p className="text-red-600 text-xs px-2">
              Both the passwords do not match.
            </p>
          )}

          <div className="flex flex-col gap-6 mt-2">
            <Button type="submit" className="w-full">
              {loadingEmail ? (
                <Loader2 strokeWidth={2.5} className="h-7 w-7 animate-spin" />
              ) : null}
              Register
            </Button>
          </div>
        </div>
        <div className="mt-2 w-full flex justify-end text-balance text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          Already have an account?{" "}
          <a
            onClick={() => router.push("/login")}
            className="ml-1 cursor-pointer"
          >
            Login
          </a>
        </div>
      </form>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our{" "}
        <a href="/terms-and-conditions" className="cursor-pointer">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy-policy" className="cursor-pointer">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
