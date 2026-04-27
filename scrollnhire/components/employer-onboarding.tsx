"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRight, Briefcase, Loader2 } from "lucide-react";
import CompanySelect from "./company-select";

export default function EmployerProfileForm({ onNext }: { onNext: any }) {
  const { data: session } = useSession();

  const [form, setForm] = useState({
    companyId: "",
    companyName: "",
    designation: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // 🔍 Validation
  const validate = () => {
    const err: any = {};

    if (!form.companyId) err.companyId = "Company is required";
    if (!form.designation) err.designation = "Designation is required";

    return err;
  };

  useEffect(() => {
    const e = validate();
    setIsValid(Object.keys(e).length === 0);
  }, [form]);

  // 🚀 Submit
  const handleSubmit = async () => {
    setSubmitted(true);
    const e = validate();
    setErrors(e);

    if (Object.keys(e).length !== 0) return;

    setLoading(true);

    try {
      const res = await fetch("/api/profile/employer", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id,
          companyId: form.companyId,
          designation: form.designation,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data.error);
        return;
      }

      // mark onboarded
      const res2 = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          isOnboarded: true,
        }),
      });

      if (!res2.ok) {
        console.error("Failed to update onboarding");
        return;
      }

      onNext(form);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-4xl italic font-playfair">
          Final Step
        </h1>
        <p className="text-xs sm:text-base text-zinc-500">
          Let’s set up your professional identity.
        </p>
      </div>

      <div className="max-w-xl px-4 mx-auto space-y-6">
        {/* 🏢 COMPANY */}
        <div className="space-y-4">
          <CompanySelect
            value={form.companyName}
            onChange={(company) =>
              setForm({
                ...form,
                companyId: company.companyId,
                companyName: company.companyName,
              })
            }
          />

          {submitted && errors.companyId && (
            <p className="text-red-500 text-sm">{errors.companyId}</p>
          )}

          {/* DESIGNATION */}
          <div>
            <Label>
              Designation <span className="text-red-500">*</span>
            </Label>
            <Input
              className="mt-2"
              placeholder="e.g. Software Engineer"
              value={form.designation}
              onChange={(e) =>
                setForm({ ...form, designation: e.target.value })
              }
            />
            {submitted && errors.designation && (
              <p className="text-red-500 text-sm">{errors.designation}</p>
            )}
          </div>
        </div>

        {/* 🚀 SUBMIT */}
        <Button
          onClick={handleSubmit}
          disabled={!isValid || loading}
          className="w-full flex items-center justify-center gap-2"
        >
          <span className="truncate">Continue Setup</span>
          {!loading && (
            <span className="material-symbols-outlined">
              <ArrowRight />
            </span>
          )}
          {loading && <Loader2 className="h-7 w-7 animate-spin" />}
        </Button>
      </div>
    </>
  );
}
