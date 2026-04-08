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
      "https://api.cloudinary.com/v1_1/dyvlnnly8/raw/upload",
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
      <div className="relative w-full overflow-hidden pr-2">
        {/* Top colorful background (just placeholder) */}
        <div className="h-16 bg-zinc-50 dark:bg-[#0f0f12]" />

        {/* U-shaped Curve */}

        {/* Content Layer */}
        <div className="relative bg-zinc-200 dark:bg-zinc-800 flex items-center gap-4 px-6 pb-4">
          {/* Profile Picture */}
          <div
            className=" relative w-20 h-20 rounded-full border-4 border-zinc-50 dark:border-[#0f0f12] -mt-[45px] bg-zinc-200 dark:bg-zinc-800"
            style={user?.image ? { backgroundImage: `url(${user.image})` } : {}}
          >
            {/* LEFT SIDE CURVE */}
            <div className="absolute top-1/2 -translate-x-1/2 bg-zinc-50 dark:bg-[#0f0f12] -left-4 w-8 h-8 rotate-74"></div>
            <div className="absolute top-[62%] -translate-x-1/2 bg-zinc-200 dark:bg-zinc-800 rounded-tr-md -left-4 -rotate-36 w-9 h-9"></div>
            <div className="absolute top-[57%] -translate-x-1/2 bg-zinc-200 dark:bg-zinc-800 -left-8 w-9 h-9"></div>

            {/* RIGHT SIDE CURVE */}
            <div className="absolute top-1/2 translate-x-1/2 bg-zinc-50 dark:bg-[#0f0f12] -right-4 w-8 h-8 -rotate-74"></div>
            <div className="absolute top-[62%] translate-x-1/2 bg-zinc-200 dark:bg-zinc-800 rounded-tl-md -right-4 rotate-36 w-9 h-9"></div>
            <div className="absolute top-[57%] translate-x-1/2 bg-zinc-200 dark:bg-zinc-800 -right-8 w-9 h-9"></div>

            {/* Replace with Image */}
          </div>

          {/* Stats */}
          <div className="flex gap-6 text-sm">
            <p>
              <span className="font-bold">1.25k</span> Followers
            </p>
            <p>
              <span className="font-bold">455</span> Followings
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
