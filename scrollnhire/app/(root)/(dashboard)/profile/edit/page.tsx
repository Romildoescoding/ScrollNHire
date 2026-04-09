"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Camera, Plus, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useUserDetails } from "@/app/hooks/useUserDetails";
import useUpdateProfile from "@/app/hooks/useUpdateProfile";
import CompanySelect from "@/components/company-select";
import CollegeSelect from "@/components/college-select";
import axios from "axios";
import { Badge } from "@/components/ui/badge";

const ProfilePage = () => {
  const { user, refetchUser } = useUserDetails();
  const { updateProfile, isUpdating } = useUpdateProfile();

  const [form, setForm] = useState<any>({
    name: "",
    image: null,
    imageUrl: "",
    skillInput: "",

    linkedin: "",
    bio: "",

    studentProfile: {
      degree: "",
      branch: "",
      cgpa: "",
      skills: "",
      github: "",
      collegeId: "",
      collegeName: "",
    },

    employerProfile: {
      designation: "",
      companyId: "",
      companyName: "",
    },
  });

  const [errors, setErrors] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);

  const updateForm = (path: string, value: any) => {
    setForm((prev: any) => {
      const keys = path.split(".");
      const newObj = { ...prev };
      let curr = newObj;

      for (let i = 0; i < keys.length - 1; i++) {
        curr[keys[i]] = { ...curr[keys[i]] };
        curr = curr[keys[i]];
      }

      curr[keys[keys.length - 1]] = value;
      return newObj;
    });
  };

  const [initialForm, setInitialForm] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const newForm = {
      name: user.name || "",
      image: null,
      imageUrl: user.image || "",

      linkedin:
        user.studentProfile?.linkedin || user.employerProfile?.linkedin || "",
      bio: user.studentProfile?.bio || user.employerProfile?.bio || "",

      studentProfile: {
        degree: user.studentProfile?.degree || "",
        branch: user.studentProfile?.branch || "",
        cgpa: user.studentProfile?.cgpa || "",
        skills: user.studentProfile?.skills || [],
        github: user.studentProfile?.github || "",
        collegeId: user.studentProfile?.collegeId || "",
        collegeName: user.studentProfile?.college?.name || "",
      },

      employerProfile: {
        designation: user.employerProfile?.designation || "",
        companyId: user.employerProfile?.companyId || "",
        companyName: user.employerProfile?.company?.name || "",
      },
    };

    setForm(newForm);
    setInitialForm(newForm); // 🧠 snapshot stored
  }, [user]);

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ Type check
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed");
      return;
    }

    // ✅ Size check (2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("Image must be less than 2MB");
      return;
    }

    updateForm("image", file);
    updateForm("imageUrl", URL.createObjectURL(file));
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

  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "profile_image_upload");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dyvlnnly8/image/upload",
      formData,
    );

    return res.data.secure_url;
  };

  const handleUpdateProfile = async () => {
    const payload: any = {
      name: form.name,
    };

    if (user.role === "student") {
      let resumeUrl = null;

      if (form.studentProfile.resume) {
        resumeUrl = await uploadResumeToCloudinary(form.studentProfile.resume);
      }
      // ADD THE LOGIC TO UPLOAD THE RESUME FILE TO CLOUDINARY AND GETTING THE URL AND ALSO MAKING SURE TO UPDATE IT.
      payload.studentProfile = {
        degree: form.studentProfile.degree,
        branch: form.studentProfile.branch,
        cgpa: Number(form.studentProfile.cgpa),
        skills: form.studentProfile.skills,
        github: form.studentProfile.github,
        linkedin: form.linkedin,
        resumeUrl: resumeUrl || "",
        bio: form.bio,
        collegeId: form.studentProfile.collegeId,
      };
    }

    if (user.role === "employer") {
      payload.employerProfile = {
        designation: form.employerProfile.designation,
        companyId: form.employerProfile.companyId,
        linkedin: form.linkedin,
        bio: form.bio,
      };
    }

    if (form.image) {
      const imageUrl = await uploadImageToCloudinary(form.image);
      payload.image = imageUrl;
    }

    const res = await updateProfile(payload);
    if (res) refetchUser();
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

    updateForm("studentProfile.resume", file);
  };

  const addSkill = () => {
    if (
      form.skillInput.trim() &&
      !form.studentProfile.skills.includes(form.skillInput.trim())
    ) {
      setForm({
        ...form,
        studentProfile: {
          ...form.studentProfile,
          skills: [...form.studentProfile.skills, form.skillInput.trim()],
        },
        skillInput: "",
      });
    }
  };

  const removeSkill = (skill: string) => {
    setForm({
      ...form,
      studentProfile: {
        ...form.studentProfile,
        skills: form.studentProfile.skills.filter((s) => s !== skill),
      },
    });
  };

  return (
    <>
      <div className="p-6 pt-2">
        {/* Image */}
        <div className="flex flex-col gap-4">
          <div className="">
            <div className="flex gap-4 w-full items-center">
              <label className="relative w-fit max-w-20 cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <Image
                  src={form.imageUrl || ""}
                  alt="user"
                  width={100}
                  height={100}
                  style={{ width: "90px", height: "80px" }}
                  className="rounded-full border h-20 aspect-square border-zinc-300 dark:border-zinc-700"
                />
              </label>
              <div className="flex flex-col justify-end gap-1 w-full h-full">
                <Button className="max-w-fit" onClick={handleImageChange}>
                  <Plus /> Change Image
                </Button>
                <span className="text-[10px] text-foreground/50">
                  We support PNGs, JPEGs under 2MB
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              Name <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Enter Name"
                value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
              />
              {submitted && errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
              <div></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email} disabled />
            </div>

            <div className="space-y-2">
              <Label>Linkedin</Label>
              <Input
                placeholder="https://www.linkedin.com/"
                value={form.linkedin}
                onChange={(e) => updateForm("linkedin", e.target.value)}
              />
              {submitted && errors.linkedin && (
                <p className="text-red-500 text-sm mt-1">{errors.linkedin}</p>
              )}
            </div>
          </div>

          {/* EMPLOYER */}
          {user.role === "employer" && (
            <div className="grid grid-cols-2 gap-4">
              <CompanySelect
                value={form.employerProfile.companyName}
                onChange={(company) => {
                  updateForm("employerProfile.companyId", company.companyId);
                  updateForm(
                    "employerProfile.companyName",
                    company.companyName,
                  );
                }}
              />

              {submitted && errors.companyId && (
                <p className="text-red-500 text-sm">{errors.companyId}</p>
              )}

              <div className="space-y-2">
                <Label>
                  Designation <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={form.employerProfile.designation}
                  onChange={(e) =>
                    updateForm("employerProfile.designation", e.target.value)
                  }
                />
              </div>
            </div>
          )}

          {/* STUDENT */}
          {user.role === "student" && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Degree <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={form.studentProfile.degree}
                    onChange={(e) =>
                      updateForm("studentProfile.degree", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Branch <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={form.studentProfile.branch}
                    onChange={(e) =>
                      updateForm("studentProfile.branch", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    CGPA <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    value={form.studentProfile.cgpa}
                    onChange={(e) =>
                      updateForm("studentProfile.cgpa", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  {/* Same pattern as CompanySelect */}
                  <CollegeSelect
                    value={form.studentProfile.collegeName}
                    onChange={(college) => {
                      updateForm("studentProfile.collegeId", college.collegeId);
                      updateForm(
                        "studentProfile.collegeName",
                        college.collegeName,
                      );
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>GitHub</Label>
                  <Input
                    placeholder="https://github.com/..."
                    value={form.studentProfile.github}
                    onChange={(e) =>
                      updateForm("studentProfile.github", e.target.value)
                    }
                  />
                </div>

                {/* College Select */}
              </div>

              {/* Resume Upload */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Resume</Label>

                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition">
                    <span className="text-sm text-foreground/60">
                      Drop your resume here or click to upload
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e: any) => handleResumeChange(e)}
                    />
                  </label>
                </div>

                <div className="space-y-2">
                  <Label>
                    Skills <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill"
                      value={form.skillInput}
                      onChange={(e) =>
                        setForm({ ...form, skillInput: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <Button
                      className="h-9 w-9 aspect-square rounded-full"
                      onClick={addSkill}
                    >
                      <Plus />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {form.studentProfile.skills.map((skill) => (
                      <Badge
                        key={skill}
                        className="rounded-full flex items-center gap-1"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation(); // 🛑 prevent weird bubbling issues
                            removeSkill(skill);
                          }}
                          className="ml-1 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                    {/* {form.studentProfile.skills.map((skill) => (
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
                    ))} */}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea
              placeholder="Tell us something about yourself..."
              value={form.bio}
              onChange={(e) => updateForm("bio", e.target.value)}
            />
          </div>

          <div className="mb-2 flex gap-4 w-40 max-w-full">
            <Button
              onClick={() => setForm(JSON.parse(JSON.stringify(initialForm)))}
              className="w-full"
              variant="outline"
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              className="w-full"
              onClick={handleUpdateProfile}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Profile"}
            </Button>
          </div>

          {/* DELETE ACCOUNT */}
          {/* <div className="space-y-2">
            <div className="flex gap-4 items-center justify-between">
              <div className="flex-1 flex flex-col gap-1 justify-center">
                <h1 className=" font-medium text-sm">Delete my Account</h1>
                <p className="text-foreground/50 text-xs">
                  Permanently delete account and all the information linked to
                  this account.
                </p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
