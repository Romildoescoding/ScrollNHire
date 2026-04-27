"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Brain,
  GraduationCap,
  Link,
  Loader2,
  X,
} from "lucide-react";
import CollegeSelect from "./college-select";
import axios from "axios";

export default function StudentProfileForm({ onNext }: { onNext: any }) {
  const { data: session } = useSession();

  const [form, setForm] = useState({
    collegeId: "",
    collegeName: "",
    rollno: "",
    degree: "",
    branch: "",
    yearOfPassing: "",
    cgpa: "",
    resume: null,
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

  // useEffect(() => {
  //   const e = validate();
  //   setIsValid(Object.keys(e).length === 0);
  // }, [form]);

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

  const uploadResumeToCloudinary = async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "resume_upload");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dyvlnnly8/auto/upload",
      formData,
    );

    return res.data.secure_url;
  };

  const handleResumeChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ Type check
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      return;
    }

    // ✅ Size check (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File size should be less than 5MB");
      return;
    }

    setForm((form) => ({ ...form, resume: file }));
  };

  // 🚀 Submit
  const handleSubmit = async () => {
    setSubmitted(true);
    const e = validate();
    setErrors(e);

    if (Object.keys(e).length !== 0) return;

    setLoading(true);

    let resumeUrl = "";
    if (form.resume) resumeUrl = await uploadResumeToCloudinary(form.resume);

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
          resumeUrl: resumeUrl,
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
            className={`font-playfair text-zinc-900 dark:text-zinc-100 tezt-2xl sm:text-4xl italic leading-tight mb-2`}
          >
            Final Step
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
            {`All of the information will help you get noticed.`}
          </p>
        </header>
      </div>
      <div className="max-w-xl px-4 pb-4 mx-auto space-y-6">
        {/* 🎓 EDUCATION */}
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
        <div className="space-y-3 border-t pt-4">
          <Label>Skills</Label>
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
                className="flex items-center gap-1 bg-zinc-200 text-zinc-700 px-3 py-1 rounded-full text-sm"
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
        <div className="space-y-3 border-t pt-4">
          <div className="flex flex-col gap-2">
            <Label>Github</Label>
            <Input
              placeholder="https://www.github.com/..."
              value={form.github}
              onChange={(e) => setForm({ ...form, github: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Linkedin</Label>
            <Input
              placeholder="https://www.linkedin.com/..."
              value={form.linkedin}
              onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
            />
          </div>
        </div>

        {/* 📝 BIO */}
        <div className="flex flex-col gap-2">
          <Label>Bio</Label>
          <Textarea
            placeholder="Tell something about yourself..."
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </div>

        {/* 📄 RESUME */}
        <div className="space-y-2">
          <Label>Resume</Label>

          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition">
            <span className="text-sm text-foreground/60">
              {form.resume
                ? form.resume.name
                : "Drop your resume here or click to upload"}
            </span>
            <input
              type="file"
              className="hidden"
              onChange={(e: any) => handleResumeChange(e)}
            />
          </label>
        </div>

        {/* 🚀 SUBMIT */}
        <Button
          onClick={handleSubmit}
          disabled={loading}
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
