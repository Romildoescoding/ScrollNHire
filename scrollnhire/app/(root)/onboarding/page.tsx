"use client";
import { useUserDetails } from "@/app/hooks/useUserDetails";
import CSOPRofileForm from "@/components/cso-onboarding";
import EmployerProfileForm from "@/components/employer-onboarding";
import StudentOnboarding from "@/components/student-onboarding";
import StudentProfileForm from "@/components/student-onboarding2";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  Forward,
  GraduationCap,
  Loader2,
  Router,
  School,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";
import posthog from "posthog-js";

// -----------------------------
// Main Onboarding Page
// -----------------------------
export default function OnboardingPage() {
  const { user, refetchUser, status, fetched } = useUserDetails();
  const router = useRouter();
  // const [step, setStep] = useState(3);
  const [step, setStep] = useState(-1);
  const [role, setRole] = useState<"student" | "employer" | "cso" | null>(null);

  useEffect(() => {
    // The userobject alwys exists with "" values for each field. so, gonna use the status as laoding for now.
    // if (status !== "authenticated") return;
    // used the fetched ref instead.
    if (!fetched) return;
    // if (!user) return;
    console.log(user);

    if (user.isOnboarded) {
      console.log("REROUTED VIA USEEFFECT");
      return router.push(user.role === "student" ? "/student" : "/employer");
    }

    if (user.role) {
      setRole(user.role);
    } else {
      // setLoading(false);
      return setStep(0);
    }
    if (!user.gender) {
      setStep(1);
    } else {
      setStep(2);
    }

    // setTimeout(() => setLoading(false), 1000);
  }, [router, user, fetched, status]);

  // useEffect(() => {
  //   console.log(role, step);
  // }, [role, step]);

  return (
    <main className="">
      {" "}
      {step < 0 ? (
        <div className="h-screen w-full flex items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>
      ) : (
        <div className="min-h-svh md:min-h-screen flex justify-center bg-zinc-50 dark:bg-zinc-950">
          <div className="w-full max-w-4xl pt-0 p-0 relative">
            {/* {step > 0 && (
          <div className="absolute top-0 left-[-36px]">
            <button
              className="fixed top-[64px] w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary/10"
              onClick={() => setStep((step) => Math.max(step - 1, 0))}
            >
              <span className="material-symbols-outlined text-zinc-900 dark:text-zinc-100">
                <ArrowLeft />
              </span>
            </button>
          </div>
        )} */}
            <div
              style={{ opacity: step < 1 ? 0 : 100 }}
              className="z-11 transition-all sticky border-b border-primary/10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl max-[639px]:left-0 top-0 w-screen sm:w-full flex flex-col gap-1 p-4"
            >
              <div className="w-full h-auto flex-1">
                <div className="flex justify-between items-center">
                  <p className="text-xs sm:text-sm font-medium">
                    {/* <p className="text-zinc-700 dark:text-zinc-300 text-sm font-medium"> */}
                    {step > 2 ? "Done" : `Step ${step} of 2`}
                  </p>
                  <p className="text-primary text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                    {/* {role === "student" && ( */}
                    {/* <> */}
                    {step === 1 && "Basic details"}
                    {step === 2 && "Additional Information"}
                    {step === 3 && "All Set!"}
                    {/* </> */}
                    {/* )} */}
                  </p>
                </div>
                <div className="h-2 w-full rounded-full bg-primary/20">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{
                      width: `${50 * (step - 1)}%`,
                      transition: "width 0.5s ease-in-out",
                    }}
                  ></div>
                </div>
              </div>
            </div>
            {step === 0 && (
              <RoleSelection
                onSelect={(r) => {
                  setRole(r);
                }}
                role={role}
                setStep={setStep}
              />
            )}

            {step === 1 && <StudentOnboarding onNext={() => setStep(2)} />}

            {step === 2 && role === "student" && (
              <StudentProfileForm onNext={() => setStep(3)} />
            )}

            {step === 2 && role === "employer" && (
              <EmployerProfileForm onNext={() => setStep(3)} />
            )}

            {/* {step === 2 && role === "cso" && (
              <CSOPRofileForm onNext={() => setStep(3)} />
            )} */}

            {step === 3 && <CompletionScreen role={role} />}
          </div>
        </div>
      )}
    </main>
  );
}

// -----------------------------
// Step 1: Role Selection
// -----------------------------
function RoleSelection({
  onSelect,
  role,
  setStep,
}: {
  onSelect: any;
  role: string | null;
  setStep: React.Dispatch<SetStateAction<number>>;
}) {
  const { update } = useSession();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  async function handleSelectRole() {
    try {
      if (!session?.user) return;
      setLoading(true);
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          role,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error(data.error);
        return;
      }
      await update({
        role,
      });
      posthog.capture("onboarding_role_selected", { role });
      setStep((step) => step + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col flex-1 pt-2 px-4 sm:px-4 py-6">
        <header className="text-center mb-8">
          <h1
            className={`font-playfair text-zinc-900 dark:text-zinc-100 text-2xl sm:text-4xl italic leading-tight mb-2`}
          >
            Who are you?
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-base">
            Select your primary goal on the platform to customize your
            experience.
          </p>
        </header>
        <div className="flex flex-col gap-4">
          <div
            className={`group relative flex flex-col gap-4 p-4 rounded-xl cursor-pointer transition-all
  bg-white dark:bg-zinc-900/50 shadow-sm
  ${
    role === "student"
      ? "border-2 border-primary shadow-md"
      : "border border-primary/20 hover:border-primary/50 hover:shadow-md"
  }`}
            onClick={() => onSelect("student")}
          >
            {role === "student" && (
              <div className="absolute top-4 right-4">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-xs font-bold">
                    <Check className=" h-3 w-3 sm:h-4 sm:w-4" />
                  </span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 sm:h-16 sm:w-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined  text-2xl sm:text-4xl">
                  <GraduationCap className="h-4 w-4 sm:h-6 sm:w-6" />
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-zinc-900 dark:text-zinc-100 text-sm sm:text-lg font-bold">
                  Student
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-[10px] sm:text-sm leading-snug">
                  I am looking for internships, entry-level jobs, and
                  networking.
                </p>
              </div>
            </div>
          </div>
          <div
            className={`group relative flex flex-col gap-4 p-4 rounded-xl cursor-pointer transition-all
  bg-white dark:bg-zinc-900/50 shadow-sm
  ${
    role === "employer"
      ? "border-2 border-primary shadow-md"
      : "border border-primary/20 hover:border-primary/50 hover:shadow-md"
  }`}
            onClick={() => onSelect("employer")}
          >
            {role === "employer" && (
              <div className="absolute top-4 right-4">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-xs font-bold">
                    <Check className=" h-3 w-3 sm:h-4 sm:w-4" />
                  </span>
                </div>
              </div>
            )}{" "}
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 sm:h-16 sm:w-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined  text-4xl">
                  <BriefcaseBusiness className="h-4 w-4 sm:h-6 sm:w-6" />
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-zinc-900 dark:text-zinc-100 text-sm sm:text-lg font-bold">
                  Employer
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-[10px] sm:text-sm leading-snug">
                  I am looking to discover and hire top student talent for my
                  company.
                </p>
              </div>
            </div>
          </div>
          {/* COMMENTING THE CODE FOR THE CSO OFFICER FOR NOW. ADDITION WOULD BE LATER ON. */}
          {/* <div
            className={`group relative flex flex-col gap-4 p-4 rounded-xl cursor-pointer transition-all
  bg-white dark:bg-zinc-900/50 shadow-sm
  ${
    role === "cso"
      ? "border-2 border-primary shadow-md"
      : "border border-primary/20 hover:border-primary/50 hover:shadow-md"
  }`}
            onClick={() => onSelect("cso")}
          >
            {role === "cso" && (
              <div className="absolute top-4 right-4">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-foreground text-xs font-bold">
                    <Check className=" h-3 w-3 sm:h-4 sm:w-4" />
                  </span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-4xl">
                  <Building2 />
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-zinc-900 dark:text-zinc-100 text-lg font-bold">
                  Placement Officer
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-snug">
                  I manage campus recruitment drives and college placement
                  activities.
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      <div className="sticky bottom-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pt-2 pb-2 border-t border-primary/10">
        {/* <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary text-primary text-lg font-bold transition-transform active:scale-95 shadow-lg shadow-primary/20"> */}
        <Button
          onClick={() => {
            if (role === null) return;
            handleSelectRole();
          }}
          className="w-full"
          disabled={role === null}
          style={{
            paddingTop: "24px",
            paddingBottom: "24px",
            cursor: role === null ? "not allowed" : "pointer",
          }}
        >
          <span className="truncate">Next</span>
          {!loading && (
            <span className="material-symbols-outlined">
              <ArrowRight />
            </span>
          )}
          {loading && <Loader2 className="h-7 w-7 animate-spin" />}
        </Button>
        {/* </button> */}
        <p className="text-center mt-3 text-xs text-zinc-500 dark:text-zinc-400">
          You cannot change your role later after this selection.
        </p>
      </div>
    </>
  );
}

// -----------------------------
// Student Flow
// -----------------------------

// -----------------------------
// Employer Flow
// -----------------------------
function EmployerOnboarding({ onNext }: { onNext: any }) {
  const [form, setForm] = useState({
    company: "",
    website: "",
    roleHiring: "",
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Tell us about your company</h2>

      <input
        placeholder="Company Name"
        className="w-full p-3 border rounded-lg"
        onChange={(e) => setForm({ ...form, company: e.target.value })}
      />

      <input
        placeholder="Company Website"
        className="w-full p-3 border rounded-lg"
        onChange={(e) => setForm({ ...form, website: e.target.value })}
      />

      <input
        placeholder="Roles you are hiring for"
        className="w-full p-3 border rounded-lg"
        onChange={(e) => setForm({ ...form, roleHiring: e.target.value })}
      />

      <button
        onClick={onNext}
        className="w-full bg-black text-white py-3 rounded-lg"
      >
        Continue
      </button>
    </div>
  );
}

// -----------------------------
// CSO Flow
// -----------------------------
function CSOOnboarding({ onNext }: { onNext: any }) {
  const [form, setForm] = useState({
    college: "",
    officialEmail: "",
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Verify your college</h2>

      <input
        placeholder="College Name"
        className="w-full p-3 border rounded-lg"
        onChange={(e) => setForm({ ...form, college: e.target.value })}
      />

      <input
        placeholder="Official Email"
        className="w-full p-3 border rounded-lg"
        onChange={(e) => setForm({ ...form, officialEmail: e.target.value })}
      />

      <button
        onClick={onNext}
        className="w-full bg-black text-white py-3 rounded-lg"
      >
        Continue
      </button>
    </div>
  );
}

// -----------------------------
// Completion Screen
// -----------------------------
function CompletionScreen({
  role,
}: {
  role: "student" | "employer" | "cso" | null;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!role)
      return console.log("Role not found dude like what the helly", role);
    else console.log(role);
    posthog.capture("onboarding_completed", { role });
    setTimeout(
      () => router.push(role === "student" ? "/student" : "/employer"),
      5000,
    );
  }, [router, role]);

  return (
    <>
      <div className="flex flex-col flex-1 pt-2">
        <header className="text-center mb-4">
          <h1
            className={`font-playfair text-zinc-900 dark:text-zinc-100 text-2xl sm:text-4xl italic leading-tight mb-2`}
          >
            {`You're all set`}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-base">
            {`Hang on! We're redirecting you to the dashboard.`}
          </p>
        </header>
      </div>
      <div className="w-full flex justify-center">
        {/* <Button onClick={() => router.push("/dashboarding")}>
          Go to Dashboard
        </Button> */}
        <Loader2 className="h-7 w-7 animate-spin" />
      </div>
    </>
  );
}
