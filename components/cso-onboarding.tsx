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
    rollno: "",
    degree: "",
    branch: "",
    yearOfPassing: "",
    cgpa: "",
    resumeUrl: "",
    github: "",
    linkedin: "",
    bio: "",
    skills: [] as string[],
    skillInput: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // 🔍 Validation
  const validate = () => {
    const err: any = {};

    if (!form.collegeId) err.collegeId = "College is required";
    if (!form.rollno) err.rollno = "Roll number is required";
    if (!form.degree) err.degree = "Degree is required";
    if (!form.branch) err.branch = "Branch is required";

    if (!form.yearOfPassing) {
      err.yearOfPassing = "Year is required";
    } else if (isNaN(Number(form.yearOfPassing))) {
      err.yearOfPassing = "Must be a number";
    }

    if (form.cgpa && (Number(form.cgpa) < 0 || Number(form.cgpa) > 10)) {
      err.cgpa = "CGPA must be between 0-10";
    }

    return err;
  };

  useEffect(() => {
    const e = validate();
    setIsValid(Object.keys(e).length === 0);
  }, [form]);

  // 🧠 Skills logic
  const addSkill = () => {
    if (
      form.skillInput.trim() &&
      !form.skills.includes(form.skillInput.trim())
    ) {
      setForm({
        ...form,
        skills: [...form.skills, form.skillInput.trim()],
        skillInput: "",
      });
    }
  };

  const removeSkill = (skill: string) => {
    setForm({
      ...form,
      skills: form.skills.filter((s) => s !== skill),
    });
  };

  // 🚀 Submit
  const handleSubmit = async () => {
    setSubmitted(true);
    const e = validate();
    setErrors(e);

    if (Object.keys(e).length !== 0) return;

    setLoading(true);

    try {
      const res = await fetch("/api/profile/student", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id,
          collegeId: form.collegeId,
          rollno: form.rollno,
          degree: form.degree,
          branch: form.branch,
          yearOfPassing: Number(form.yearOfPassing),
          cgpa: form.cgpa ? Number(form.cgpa) : undefined,
          resumeUrl: form.resumeUrl,
          skills: form.skills,
          github: form.github,
          linkedin: form.linkedin,
          bio: form.bio,
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
            Final Step
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            {`All of the information will help you get noticed.`}
          </p>
        </header>
      </div>
      <div className="max-w-xl mx-auto space-y-6">
        {/* 🎓 EDUCATION */}
        <div className="space-y-4">
          <h2 className="text-xl flex gap-3 items-center font-semibold">
            <GraduationCap size={24} />
            Education
          </h2>

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

          <div>
            <Label>
              Roll Number <span className="text-red-500">*</span>
            </Label>
            <Input
              className="mt-2"
              value={form.rollno}
              onChange={(e) => setForm({ ...form, rollno: e.target.value })}
            />
            {submitted && errors.rollno && (
              <p className="text-red-500 text-sm">{errors.rollno}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>
                Degree <span className="text-red-500">*</span>
              </Label>
              <Input
                className="mt-2"
                placeholder="B.Tech"
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
              />
              {submitted && errors.degree && (
                <p className="text-red-500 text-sm">{errors.degree}</p>
              )}
            </div>

            <div>
              <Label>
                Branch <span className="text-red-500">*</span>
              </Label>
              <Input
                className="mt-2"
                placeholder="CSE"
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
              />
              {submitted && errors.branch && (
                <p className="text-red-500 text-sm">{errors.branch}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>
                Graduation Year <span className="text-red-500">*</span>
              </Label>
              <Input
                className="mt-2"
                placeholder="2025"
                value={form.yearOfPassing}
                onChange={(e) =>
                  setForm({ ...form, yearOfPassing: e.target.value })
                }
              />
              {submitted && errors.yearOfPassing && (
                <p className="text-red-500 text-sm">{errors.yearOfPassing}</p>
              )}
            </div>

            <div>
              <Label>CGPA</Label>
              <Input
                className="mt-2"
                placeholder="8.5"
                value={form.cgpa}
                onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
              />
              {submitted && errors.cgpa && (
                <p className="text-red-500 text-sm">{errors.cgpa}</p>
              )}
            </div>
          </div>
        </div>

        {/* 🧠 SKILLS */}
        <div className="space-y-3">
          <h2 className="text-xl flex gap-3 items-center font-semibold">
            <Brain size={24} />
            Skills
          </h2>

          <div className="flex gap-2">
            <Input
              placeholder="Add a skill"
              value={form.skillInput}
              onChange={(e) => setForm({ ...form, skillInput: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
            />
            <Button onClick={addSkill}>Add</Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {form.skills.map((skill) => (
              <div
                key={skill}
                className="flex items-center gap-1 bg-neutral-200 text-neutral-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => removeSkill(skill)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 🔗 LINKS */}
        <div className="space-y-3">
          <h2 className="text-xl flex gap-3 items-center font-semibold">
            <Link size={24} /> Links
          </h2>

          <Input
            placeholder="GitHub URL"
            value={form.github}
            onChange={(e) => setForm({ ...form, github: e.target.value })}
          />

          <Input
            placeholder="LinkedIn URL"
            value={form.linkedin}
            onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
          />
        </div>

        {/* 📝 BIO */}
        <div>
          <Label>Bio</Label>
          <Textarea
            placeholder="Tell something about yourself..."
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </div>

        {/* 📄 RESUME */}
        <div>
          <Label>Resume URL</Label>
          <Input
            placeholder="https://..."
            value={form.resumeUrl}
            onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
          />
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
