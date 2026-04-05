"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Brain, GraduationCap, Link, Loader2, X } from "lucide-react";
import CollegeSelect from "./college-select";

export default function CSOPRofileForm({ onNext }: { onNext: any }) {
  const { data: session } = useSession();

  const [form, setForm] = useState({
    collegeId: "",
    collegeName: "",
    batchSize: 500,
    designation: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // 🔍 Validation
  const validate = () => {
    const err: any = {};

    if (!form.collegeId) err.collegeId = "College is required";
    if (!form.designation) err.collegeId = "Designation is required";
    // if (!form.batchSize) err.rollno = "Batch Size is required";

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
      const res = await fetch("/api/profile/cso", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id,
          collegeId: form.collegeId,
          designation: form.designation,
          // batchSize: form.batchSize,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data.error);
        return;
      }

      // Set that the user HAS BEEN ONBOARDED.
      const res2 = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          isOnboarded: true,
        }),
      });

      const data2 = await res2.json();

      if (!res2.ok) {
        console.error(data2.error);
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
      <div className="flex flex-col flex-1 pt-2">
        <header className="text-center mb-8">
          <h1
            className={`font-playfair text-slate-900 dark:text-slate-100 text-4xl italic leading-tight mb-2`}
          >
            College Information
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            {`Tell us about your college and the needs.`}
          </p>
        </header>
      </div>
      <div className="max-w-xl mx-auto space-y-6">
        <div className="space-y-4">
          <CollegeSelect
            value={form.collegeName}
            onChange={(college) =>
              setForm({
                ...form,
                collegeId: college.collegeId,
                collegeName: college.collegeName,
              })
            }
          />
          {submitted && errors.collegeId && (
            <p className="text-red-500 text-sm">{errors.collegeId}</p>
          )}

          <div className="grid gap-4">
            <div>
              <Label>
                {`Designation`}
                <span className="text-red-500 text-sm">*</span>
              </Label>
              <Input
                className="mt-2"
                placeholder="e.g. Hiring Manager"
                value={form.designation}
                onChange={(e) =>
                  setForm({ ...form, designation: e.target.value })
                }
              />
              {submitted && errors.designation && (
                <p className="text-red-500 text-sm">{errors.designation}</p>
              )}
            </div>
            <div>
              <Label>{`Estimated Batch Size (Final Year)`}</Label>
              <Input
                type="number"
                className="mt-2"
                placeholder="e.g 500"
                value={form.batchSize}
                onChange={(e) =>
                  setForm({ ...form, batchSize: Number(e.target.value) })
                }
              />
              {submitted && errors.batchSize && (
                <p className="text-red-500 text-sm">{errors.batchSize}</p>
              )}
            </div>
          </div>
        </div>

        {/* 🚀 SUBMIT */}
        <Button
          onClick={handleSubmit}
          disabled={!isValid || loading}
          className="w-full flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Saving..." : "Continue Setup"}
        </Button>
      </div>
    </>
  );
}
