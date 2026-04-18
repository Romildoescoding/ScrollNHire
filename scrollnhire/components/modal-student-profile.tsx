"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { IStudent } from "@/app/hooks/useStudents";
import { Dialog, DialogContent } from "./ui/dialog";
import { Viewer, Worker } from "@react-pdf-viewer/core";

const ModalProfile = ({
  student,
  open,
  onOpenChange,
}: {
  student: IStudent | null;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] overflow-y-auto w-full min-w-3xl">
        <div className="p-6 pt-2 flex flex-col gap-4">
          {/* Image */}
          <div className="flex gap-4 items-center">
            <div className="flex gap-4 w-fit items-center">
              <Image
                src={student?.image || ""}
                alt="user"
                width={100}
                height={100}
                style={{ width: "120px", height: "120px" }}
                className="rounded-full border h-50 aspect-square border-zinc-300 dark:border-zinc-700"
              />
            </div>

            <div className="flex-1 w-full flex flex-col">
              <div className="text-lg text-extrabold">{student?.name}</div>

              <div className="text-muted-foreground text-sm">
                {student?.degree} {student?.branch}
                {/* at{" "} */}
                {/* {student?.collegeName} */}
              </div>
            </div>
          </div>
          <div className="w-full h-fit text-muted-foreground">
            {student?.bio}
          </div>

          <div className="space-y-2">
            <Label>Skills</Label>

            <div className="flex flex-wrap gap-2">
              {(student?.skills ?? []).map((skill) => (
                <Badge
                  key={skill}
                  className="rounded-full flex items-center gap-1"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Resume</Label>

            {student?.resumeUrl ? (
              <div
                onClick={() => window.open(student?.resumeUrl, "_blank")}
                className="w-full h-64 border rounded-md overflow-hidden cursor-pointer hover:shadow-md transition flex justify-center"
              >
                <div className="relative w-[488px] h-full overflow-hidden border-b-2 px-4">
                  {/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js"> */}
                  <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js">
                    <div>
                      <Viewer
                        defaultScale={0.75}
                        fileUrl={student?.resumeUrl}
                      />
                    </div>
                  </Worker>
                </div>
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

          <div className="flex flex-col gap-3">
            <h1>Contact Information</h1>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  placeholder="abc@example.com"
                  value={student?.email}
                  disabled={true}
                />
              </div>
              <div className="space-y-2">
                <Label>Linkedin</Label>
                <Input
                  placeholder="https://linkedin.com/..."
                  value={student?.linkedin}
                  disabled={true}
                />
              </div>
              <div className="space-y-2">
                <Label>GitHub</Label>
                <Input
                  placeholder="https://github.com/..."
                  value={student?.github}
                  disabled={true}
                />
              </div>
            </div>

            <Tabs defaultValue="projects" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger className="" value="projects">
                  Projects
                </TabsTrigger>
                <TabsTrigger className="" value="reels">
                  Reels
                </TabsTrigger>
              </TabsList>
              <TabsContent className="grid grid-cols-3 gap-4" value="projects">
                {(student?.projects ?? [])?.map((project, i) => (
                  <Card
                    className="relative py-2 flex flex-col justify-between"
                    key={i}
                  >
                    <CardContent className="text-sm flex flex-col gap-2 px-2">
                      <div className="w-full h-fit">
                        <Image
                          src={project.thumbnail || "/placeholder.png"}
                          className="w-full rounded-md"
                          alt="project_image"
                          height={500}
                          width={500}
                        />
                      </div>

                      <div className="flex flex-col">
                        <span></span>
                        <div className="flex justify-between w-full">
                          <div className="font-semibold flex-1 max-w-[80%] text-base">
                            {project.title}
                          </div>
                          {/* {project.liveUrl && ( */}
                          <Button
                            variant="outline"
                            className="rounded-full h-8 min-w-8 w-8 flex items-center justify-center"
                            style={{ padding: 0 }}
                            disabled={!project.liveUrl}
                          >
                            <Link
                              href={project.liveUrl ?? "/projects"}
                              target="_blank"
                              className="min-w-fit"
                            >
                              <ExternalLink size={18} />
                            </Link>
                          </Button>
                          {/* )} */}
                        </div>
                        <div className="text-muted-foreground">
                          {project.description}
                        </div>
                      </div>

                      {/* Tech stack badges */}
                      <div className="flex flex-wrap gap-2">
                        {(project.techStack || []).map(
                          (tech: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-xs bg-muted px-2 py-1 rounded-full"
                            >
                              {tech}
                            </span>
                          ),
                        )}
                      </div>
                    </CardContent>
                    <p className="flex w-full justify-end p-2 pb-0">
                      <Badge
                        className={cn(
                          "flex rounded-full items-center gap-2 p-1 capitalize",
                          project.difficultyLevel === "advanced"
                            ? "bg-red-300 text-red-600"
                            : project.difficultyLevel === "intermediate"
                              ? "bg-blue-300 text-blue-600"
                              : "bg-green-300 text-green-600",
                        )}
                      >
                        <span
                          className={cn(
                            "flex w-3 h-3 rounded-full",
                            project.difficultyLevel === "advanced"
                              ? "bg-red-500"
                              : project.difficultyLevel === "intermediate"
                                ? "bg-blue-500"
                                : "bg-green-500",
                          )}
                        ></span>
                        {project.difficultyLevel ?? "Beginner"}
                      </Badge>
                    </p>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="reels">
                <div className="columns-2 md:columns-3 gap-3 space-y-3">
                  {(student?.reels ?? []).map((reel, index) => {
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
                          className={`w-full object-cover transition duration-500  ${
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
                        <div className="absolute bottom-2 left-2 right-2 text-white text-sm z-10">
                          {/* <p className="font-semibold truncate">{reel.user.name}</p> */}
                          <p className="truncate opacity-70">{reel.caption}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalProfile;
