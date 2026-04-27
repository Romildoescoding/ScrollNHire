"use client";
import type React from "react";
import { Eye, EyeClosed, GalleryVerticalEnd, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormEvent, useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { Input } from "./ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [loading, setLoading] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  // HANDLE NEXTAUTH REDIRECT ERRORS (like Google OAuth issues)
  useEffect(() => {
    const err = searchParams.get("error");
    if (err) {
      if (err === "OAuthAccountNotLinked") {
        setErrorMessage(
          "Account exists with different login provider. Use the correct provider.",
        );
      } else if (err === "CredentialsSignin") {
        setErrorMessage("Invalid email or password.");
      } else {
        setErrorMessage("Login failed. Please try again.");
      }
    }
  }, [searchParams]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await signIn("google", {
        redirect: false, // prevent auto redirect
        callbackUrl: "/callback", // where to go after login
      });

      setLoading(false);

      // Case: Google denied permission or other error
      if (res?.error) {
        setErrorMessage("Google Sign-in failed. Please try again.");
        // toast(res.error, {
        //   className: "bg-red-100 text-red-700 border border-red-300",
        // });
        return;
      }

      // Case: Successful
      const url = res?.url || "/callback";
      router.push(url);
    } catch (err) {
      setLoading(false);
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");

    if (!err) return;

    if (err === "USE_GOOGLE") {
      setErrorMessage("Please login using Google for this account.");
    } else if (err === "CredentialsSignin") {
      setErrorMessage("Invalid email or password.");
    } else {
      setErrorMessage("Login failed. Try again.");
    }
  }, []);

  async function handleLoginViaMailPass(e: SubmitEvent) {
    e.preventDefault();
    setLoadingEmail(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoadingEmail(false);

    console.log(res);

    // INVALID EMAIL/PASSWORD
    if (res?.error === "CredentialsSignin") {
      setErrorMessage("Invalid email or password.");
      return;
    }

    // BLOCKED PROVIDER
    if (res?.error?.startsWith("USE_")) {
      // const provider = res.error.replace("USE_", "").toLowerCase();
      setErrorMessage(
        `This email is registered with Google. Please Continue with Google.`,
      );
      // setErrorMessage(
      //   `This email is registered with ${provider}. Please login using ${provider}.`
      // );
      return;
    }

    setErrorMessage("");
    // SUCCESS
    router.push("/callback");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">ScrollnHire.</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to ScrollnHire.</h1>
            <div className="text-center text-sm">
              Please Login to get started
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

      <form onSubmit={handleLoginViaMailPass}>
        <div className="flex flex-col gap-4">
          {/* email input */}
          <div className="relative w-full">
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

          <div className="flex flex-col gap-6">
            <Button type="submit" className="w-full">
              {loadingEmail ? (
                <Loader2 strokeWidth={2.5} className="h-7 w-7 animate-spin" />
              ) : null}
              Login
            </Button>
          </div>
        </div>
        <div className="mt-2 w-full flex justify-end text-balance text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          Don't have an account?{" "}
          <a
            onClick={() => router.push("/signup")}
            className="ml-1 cursor-pointer"
          >
            Sign up
          </a>
        </div>
      </form>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our{" "}
        <a onClick={() => router.push("/terms")} className="cursor-pointer">
          Terms of Service
        </a>{" "}
        and{" "}
        <a onClick={() => router.push("/privacy")} className="cursor-pointer">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
