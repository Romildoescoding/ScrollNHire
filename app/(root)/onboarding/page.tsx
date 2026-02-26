"use client";
import StudentOnboarding from "@/components/student-onboarding";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  Forward,
  GraduationCap,
  School,
} from "lucide-react";
import { SetStateAction, useState } from "react";

// -----------------------------
// Main Onboarding Page
// -----------------------------
export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<"student" | "employer" | "cso" | null>(null);

  return (
    <div className="min-h-screen flex justify-center bg-gray-50">
      <div className="w-full max-w-4xl pt-0 p-6 relative">
        {step > 0 && (
          <div className="absolute top-0 left-[-36px]">
            <button
              className="fixed top-[64px] w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary/10"
              onClick={() => setStep((step) => Math.max(step - 1, 0))}
            >
              <span className="material-symbols-outlined text-slate-900 dark:text-slate-100">
                <ArrowLeft />
              </span>
            </button>
          </div>
        )}
        <div
          style={{ opacity: step < 1 ? 0 : 100 }}
          className=" transition-all sticky border-b border-primary/10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl top-[56px] flex flex-col gap-1  p-4"
        >
          <div className="w-full h-auto flex-1">
            <div className="flex justify-between items-center">
              <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                Step {step} of 4
              </p>
              <p className="text-primary text-xs font-bold uppercase tracking-wider">
                Role Selection
              </p>
            </div>
            <div className="h-2 w-full rounded-full bg-primary/20">
              <div
                className="h-2 rounded-full bg-primary"
                style={{
                  width: `${25 * step}%`,
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

        {step === 1 && role === "student" && (
          <StudentOnboarding onNext={() => setStep(2)} />
        )}

        {step === 1 && role === "employer" && (
          <EmployerOnboarding onNext={() => setStep(2)} />
        )}

        {step === 1 && role === "cso" && (
          <CSOOnboarding onNext={() => setStep(2)} />
        )}

        {step === 2 && <CompletionScreen />}
      </div>
    </div>
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
  return (
    <>
      <div className="flex flex-col flex-1 pt-2 px-4 py-6">
        <header className="text-center mb-8">
          <h1
            className={`font-playfair text-slate-900 dark:text-slate-100 text-4xl italic leading-tight mb-2`}
          >
            Who are you?
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            Select your primary goal on the platform to customize your
            experience.
          </p>
        </header>
        <div className="flex flex-col gap-4">
          <div
            className={`group relative flex flex-col gap-4 p-4 rounded-xl cursor-pointer transition-all
  bg-white dark:bg-slate-900/50 shadow-sm
  ${
    role === "student"
      ? "border-2 border-primary shadow-md"
      : "border border-primary/20 hover:border-primary/50 hover:shadow-md"
  }`}
            onClick={() => onSelect("student")}
          >
            {role === "student" && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-xs font-bold">
                    <Check size={18} />
                  </span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-4xl">
                  <GraduationCap />
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold">
                  Student
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-snug">
                  I am looking for internships, entry-level jobs, and
                  networking.
                </p>
              </div>
            </div>
          </div>
          <div
            className={`group relative flex flex-col gap-4 p-4 rounded-xl cursor-pointer transition-all
  bg-white dark:bg-slate-900/50 shadow-sm
  ${
    role === "employer"
      ? "border-2 border-primary shadow-md"
      : "border border-primary/20 hover:border-primary/50 hover:shadow-md"
  }`}
            onClick={() => onSelect("employer")}
          >
            {role === "employer" && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-xs font-bold">
                    <Check size={18} />
                  </span>
                </div>
              </div>
            )}{" "}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-4xl">
                  <BriefcaseBusiness />
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold">
                  Employer
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-snug">
                  I am looking to discover and hire top student talent for my
                  company.
                </p>
              </div>
            </div>
          </div>
          <div
            className={`group relative flex flex-col gap-4 p-4 rounded-xl cursor-pointer transition-all
  bg-white dark:bg-slate-900/50 shadow-sm
  ${
    role === "cso"
      ? "border-2 border-primary shadow-md"
      : "border border-primary/20 hover:border-primary/50 hover:shadow-md"
  }`}
            onClick={() => onSelect("cso")}
          >
            {role === "cso" && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-xs font-bold">
                    <Check size={18} />
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
                <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold">
                  Placement Officer
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-snug">
                  I manage campus recruitment drives and college placement
                  activities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pt-2 pb-2 border-t border-primary/10">
        {/* <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary text-primary text-lg font-bold transition-transform active:scale-95 shadow-lg shadow-primary/20"> */}
        <Button
          onClick={() => {
            if (role === null) return;
            setStep((step) => step + 1);
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
          <span className="material-symbols-outlined">
            <ArrowRight />
          </span>
        </Button>
        {/* </button> */}
        <p className="text-center mt-3 text-xs text-slate-500 dark:text-slate-400">
          You can change your role later in account settings.
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
function CompletionScreen() {
  return (
    <div className="text-center space-y-4">
      <h2 className="text-2xl font-bold">You're all set 🚀</h2>
      <p className="text-gray-600">Your profile is ready to go live.</p>

      <button className="bg-black text-white px-6 py-3 rounded-lg">
        Go to Dashboard
      </button>
    </div>
  );
}
