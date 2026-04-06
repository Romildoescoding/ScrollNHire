"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Camera, Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useUserDetails } from "@/app/hooks/useUserDetails";
import useUpdateProfile from "@/app/hooks/useUpdateProfile";
import CompanySelect from "@/components/company-select";

const ProfilePage = () => {
  const { user, refetchUser } = useUserDetails();
  const { updateProfile, isUpdating } = useUpdateProfile();

  // common
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  // student
  const [degree, setDegree] = useState("");
  const [branch, setBranch] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [skills, setSkills] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [bio, setBio] = useState("");

  // employer
  const [designation, setDesignation] = useState("");

  useEffect(() => {
    if (!user) return;

    setFirstName(user.name || "");
    setLastName(user.name || "");
    setImageUrl(user.image);

    if (user.role === "student") {
      const profile = user.studentProfile || {};
      setDegree(profile.degree || "");
      setBranch(profile.branch || "");
      setCgpa(profile.cgpa || "");
      setSkills((profile.skills || []).join(", "));
      setGithub(profile.github || "");
      setLinkedin(profile.linkedin || "");
      setBio(profile.bio || "");
    }

    if (user.role === "employer") {
      const profile = user.employerProfile || {};
      setDesignation(profile.designation || "");
    }
  }, [user]);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async () => {
    const payload: any = {
      name,
    };

    if (user.role === "student") {
      payload.studentProfile = {
        degree,
        branch,
        cgpa: Number(cgpa),
        skills: skills.split(",").map((s) => s.trim()),
        github,
        linkedin,
        bio,
      };
    }

    if (user.role === "employer") {
      payload.employerProfile = {
        designation,
      };
    }

    if (image) {
      // assume upload fn exists
      payload.image = imageUrl;
    }

    const res = await updateProfile(payload);
    if (res) refetchUser();
  };

  const [errors, setErrors] = useState<any>({});
  //   const [colleges, setColleges] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [companyId, setCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");

  return (
    <>
      <div className="p-6 pt-2">
        {/* Image */}
        <div className="flex flex-col gap-4">
          <div className="">
            <div className="flex gap-4 w-full items-center">
              <label className="relative w-fit max-w-20 cursor-pointer">
                {/* <Camera className="absolute bottom-0 right-0 bg-zinc-900 text-white p-1 rounded-full" /> */}
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <Image
                  src={imageUrl || ""}
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
              <div>
                <Input
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {submitted && errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <Input
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {submitted && errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
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
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
              />
              {submitted && errors.linkedin && (
                <p className="text-red-500 text-sm mt-1">{errors.linkedin}</p>
              )}
            </div>
          </div>

          {/* EMPLOYER FIELDS */}
          {user.role === "employer" && (
            <div className="grid grid-cols-2 gap-4">
              <CompanySelect
                value={companyName}
                onChange={(company) => {
                  setCompanyId(company.companyId);
                  setCompanyName(company.companyName);
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
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea
              placeholder="Tell us something about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="mb-2 flex gap-4 w-40 max-w-full">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => {}}
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

          <div className="space-y-2">
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
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col gap-2 p-6 pt-2">
      
      <label className="relative w-fit max-w-25 cursor-pointer">
        <Image
          src={imageUrl || ""}
          alt="user"
          width={100}
          height={100}
          className="rounded-full border h-25 aspect-square border-zinc-300 dark:border-zinc-700"
        />
        <Camera className="absolute bottom-0 right-0 bg-zinc-900 text-white p-1 rounded-full" />
        <input type="file" className="hidden" onChange={handleImageChange} />
      </label>

      <div
        className="grid grid-cols-1
      sm:grid-cols-2 gap-4"
      >
        <div className="space-y-2">
          <Label>
            Name <span className="text-red-500">*</span>
          </Label>

          <Input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {submitted && errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={user?.email} disabled />
        </div>
      </div>

      {user.role === "employer" && (
        <div>
          <Label>Designation</Label>
          <Input
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />
        </div>
      )}

      {user.role === "student" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Degree</Label>
              <Input
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
              />
            </div>
            <div>
              <Label>Branch</Label>
              <Input
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>CGPA</Label>
            <Input value={cgpa} onChange={(e) => setCgpa(e.target.value)} />
          </div>

          <div>
            <Label>Skills (comma separated)</Label>
            <Input value={skills} onChange={(e) => setSkills(e.target.value)} />
          </div>

          <div>
            <Label>GitHub</Label>
            <Input value={github} onChange={(e) => setGithub(e.target.value)} />
          </div>

          <div>
            <Label>LinkedIn</Label>
            <Input
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
          </div>

          <div>
            <Label>Bio</Label>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
        </>
      )}

      

      <Button
        onClick={handleUpdateProfile}
        className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black"
        disabled={isUpdating}
      >
        {isUpdating ? "Updating..." : "Update Profile"}
      </Button>
    </div> */}
    </>
  );
};

export default ProfilePage;
