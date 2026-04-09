"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Camera, ExternalLink, Plus, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserDetails } from "@/app/hooks/useUserDetails";
import useUpdateProfile from "@/app/hooks/useUpdateProfile";
import CompanySelect from "@/components/company-select";
import CollegeSelect from "@/components/college-select";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useUserProfileDetails } from "@/app/hooks/useUserProfileDetails";

const LOGO_DEV_KEY = process.env.NEXT_PUBLIC_LOGO_DEV_PUBLIC_KEY!;

const ProfilePage = () => {
  const params = useParams<{ user_tag: string }>();

  const { user } = useUserProfileDetails(params.user_tag);

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
      reels: [],
      projects: [],
      resumeUrl: "",
    },

    employerProfile: {
      designation: "",
      companyId: "",
      companyName: "",
    },
  });

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
        reels: user.studentProfile?.reels || [],
        projects: user.studentProfile?.projects || [],
        resumeUrl: user.studentProfile?.resumeUrl || "",
      },

      employerProfile: {
        designation: user.employerProfile?.designation || "",
        companyId: user.employerProfile?.companyId || "",
        companyName: user.employerProfile?.company?.name || "",
        companyDomain: user.employerProfile?.company?.domain || "",
      },
    };

    setForm(newForm);
    setInitialForm(newForm); // 🧠 snapshot stored
  }, [user]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const router = useRouter();

  return (
    <>
      <div className="p-6 pt-2 flex flex-col gap-4">
        {/* Image */}
        <div className="flex gap-4 items-center">
          <div className="flex gap-4 w-fit items-center">
            <Image
              src={form.imageUrl || ""}
              alt="user"
              width={100}
              height={100}
              style={{ width: "120px", height: "120px" }}
              className="rounded-full border h-50 aspect-square border-zinc-300 dark:border-zinc-700"
            />
          </div>

          <div className="flex-1 w-full flex flex-col">
            <div className="text-lg text-extrabold">{form.name}</div>
            {user.role === "employer" && (
              <div className="text-muted-foreground text-sm">
                {form.employerProfile.designation} at{" "}
                {form.employerProfile.companyName}
              </div>
            )}
            {user.role === "student" && (
              <div className="text-muted-foreground text-sm">
                {form.studentProfile.degree} {form.studentProfile.branch} at{" "}
                {form.studentProfile.collegeName}
              </div>
            )}
          </div>
        </div>
        <div className="w-full h-fit text-muted-foreground">{form.bio}</div>

        {user.role === "student" && (
          <div className="space-y-2">
            <Label>Skills</Label>

            <div className="flex flex-wrap gap-2">
              {(form.studentProfile.skills ?? []).map((skill) => (
                <Badge
                  key={skill}
                  className="rounded-full flex items-center gap-1"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {user.role === "student" && (
          <div className="space-y-2">
            <Label>Resume</Label>

            {form.studentProfile.resumeUrl ? (
              <div
                onClick={() =>
                  window.open(form.studentProfile.resumeUrl, "_blank")
                }
                className="w-full h-64 border rounded-md overflow-hidden cursor-pointer hover:shadow-md transition"
              >
                <iframe
                  src={`${form.studentProfile.resumeUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-full pointer-events-none"
                />
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg  transition">
                {" "}
                <span className="text-sm text-foreground/60">
                  No resume uploaded
                </span>{" "}
              </label>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <h1>Contact Information</h1>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                placeholder="abc@example.com"
                value={user.email}
                disabled={true}
              />
            </div>
            <div className="space-y-2">
              <Label>Linkedin</Label>
              <Input
                placeholder="https://linkedin.com/..."
                value={form.linkedin}
                disabled={true}
              />
            </div>
            {user.role === "student" && (
              <div className="space-y-2">
                <Label>GitHub</Label>
                <Input
                  placeholder="https://github.com/..."
                  value={form.studentProfile.github}
                  disabled={true}
                />
              </div>
            )}
          </div>

          {user.role === "student" && (
            <Tabs defaultValue="projects" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger className="" value="projects">
                  Projects
                </TabsTrigger>
                <TabsTrigger className="" value="reels">
                  Reels
                </TabsTrigger>
              </TabsList>
              <TabsContent className="grid grid-cols-4" value="projects">
                {(form.studentProfile.projects ?? [])?.map((project) => (
                  <Card key={project._id}>
                    <CardContent className="text-sm flex flex-col text-muted-foreground">
                      <div className="w-full h-fit">
                        <Image
                          src={project.image}
                          className="w-full aspect-auto"
                          alt={"project_image"}
                          height={1200}
                          width={1200}
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className=" flex-1 w-full flex flex-col">
                          <div className="text-md text-semibold">
                            {project.title}
                          </div>
                          <div className="text-muted-foreground">
                            {project.desc}
                          </div>
                        </div>
                        <Link href={project.link} className="">
                          <ExternalLink />
                        </Link>
                      </div>

                      <div className=""> {project.description}</div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="reels">
                <div className="columns-2 md:columns-3 gap-3 space-y-3">
                  {(form.studentProfile.reels ?? []).map((reel, index) => {
                    const isSquare = false;

                    return (
                      <div
                        key={reel._id}
                        onClick={() => router.push(`/reels/${reel._id}`)}
                        className="break-inside-avoid cursor-pointer rounded-xl overflow-hidden relative group"
                      >
                        {/* 🖼️ THUMBNAIL */}
                        <img
                          src={reel.thumbnailUrl}
                          alt="reel"
                          loading="lazy"
                          className={`w-full object-cover transition duration-500 blur-sm group-hover:blur-0 ${
                            isSquare ? "aspect-square" : "aspect-[2/3]"
                          }`}
                        />

                        {/* 🎥 HOVER PREVIEW (DESKTOP) */}
                        {!isMobile && (
                          <video
                            src={reel.videoUrl}
                            muted
                            loop
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition duration-300"
                            onMouseEnter={(e) => e.currentTarget.play()}
                            onMouseLeave={(e) => {
                              e.currentTarget.pause();
                              e.currentTarget.currentTime = 0;
                            }}
                          />
                        )}

                        {/* overlay */}
                        <div className="absolute bottom-2 left-2 right-2 text-white text-xs z-10">
                          {/* <p className="font-semibold truncate">{reel.user.name}</p> */}
                          <p className="truncate opacity-70">{reel.caption}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          )}

          {/* <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user?.email} disabled />
              </div>
  
              <div className="space-y-2">
                <Label>Linkedin</Label>
                <Input
                  placeholder="https://www.linkedin.com/"
                  value={form.linkedin}
                 
                />
              </div>
              <div className="space-y-2">
                <Label>Github</Label>
                <Input
                  placeholder="https://www.github.com/"
                  value={form.studentProfile.github}
                 
                />
              </div>
            </div> */}

          {/* EMPLOYER */}
          {user.role === "employer" && (
            // <CompanySelect
            //   value={form.employerProfile.companyName}
            //   onChange={() => {}}
            // />

            <div className="grid grid-cols-2">
              <div className="space-y-2">
                <Label>Company</Label>
                <div className="flex gap-4 items-center">
                  <Image
                    src={`https://img.logo.dev/${form.employerProfile?.companyDomain}?token=${LOGO_DEV_KEY}`}
                    alt="logo"
                    width={20}
                    height={20}
                  />
                  <Input
                    placeholder="Company XYZ"
                    value={form.employerProfile.companyName}
                    disabled={true}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
