"use client";

import useCreateProject from "@/app/hooks/useCreateProject";
import useProjects from "@/app/hooks/useProjects";
import useUpdateProject from "@/app/hooks/useUpdateProjects";
import { IProject } from "@/app/models/ProjectModel";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import axios from "axios";

import { ExternalLink, Pencil, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";

/* ================= TYPES ================= */

type FormState = {
  title: string;
  description: string;
  techStack: string;
  githubUrl: string;
  liveUrl: string;
  category: string;
  difficultyLevel: "beginner" | "intermediate" | "advanced" | "";
};

function getPublicIdFromUrl(url: string) {
  try {
    const parts = url.split("/upload/")[1];
    // v1775809674/np1wjfidzi5u2nbuwos4.mp4

    const withoutVersion = parts.split("/").slice(1).join("/");
    // np1wjfidzi5u2nbuwos4.mp4

    const publicId = withoutVersion.replace(/\.[^/.]+$/, "");
    // np1wjfidzi5u2nbuwos4

    return publicId;
  } catch {
    return null;
  }
}

/* ================= COMPONENT ================= */

const ProjectPage = () => {
  const { projects, setProjects } = useProjects();
  const { updateProject, isUpdating } = useUpdateProject();
  const { createProject, isCreating } = useCreateProject();

  const [openCreateProject, setOpenCreateProject] = useState(false);
  const [openEditProject, setOpenEditProject] = useState(false);

  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    techStack: "",
    githubUrl: "",
    liveUrl: "",
    category: "",
    difficultyLevel: "",
  });

  const [formError, setFormError] = useState<string | null>(null);

  /* ================= HANDLERS ================= */

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      techStack: "",
      githubUrl: "",
      liveUrl: "",
      category: "",
      difficultyLevel: "",
    });
    setFormError(null);
  };

  //   const [video, setVideo] = useState("");

  //   function scrollToTop(){}

  const handleCreateProject = async () => {
    setFormError(null);

    // 🔥 Validation layer
    if (!form.title.trim()) {
      // scrollToTop();
      return setFormError("Title is required");
    }

    if (!video) return setFormError("Project preview is required");

    let videoUrl, thumbnailUrl;

    if (video) {
      const val = await uploadVideo();
      if (!val) {
        return setFormError("Video upload failed");
      }
      videoUrl = val.videoUrl;
      thumbnailUrl = val.thumbnailUrl;
    }

    try {
      const payload = {
        title: form.title,
        description: form.description,
        techStack: form.techStack
          ? form.techStack.split(",").map((t) => t.trim())
          : [],
        githubUrl: form.githubUrl,
        liveUrl: form.liveUrl,
        videoUrl: videoUrl,
        thumbnail: thumbnailUrl,
        category: form.category,
        difficultyLevel:
          form.difficultyLevel === "" ? undefined : form.difficultyLevel,
      };

      const res = await createProject(payload);

      if (!res?.success) {
        throw new Error(res?.error || "Failed to create project");
      }

      // ⚡ Optimistic UI update
      setProjects((prev: any) => [res.data, ...(prev || [])]);

      resetForm();
      setOpenCreateProject(false);
    } catch (err: any) {
      setFormError(err.message || "Something went wrong");
      console.error(err);
    }
  };

  const uploadVideo = async () => {
    if (!video) return;
    // if (!session?.user) return;

    // setLoading(true);

    try {
      if (video.size > 20 * 1024 * 1024) {
        return setFormError("Video must be under 20MB");
      }
      const formData = new FormData();
      formData.append("file", video);
      formData.append("upload_preset", "project_preview_upload");

      const cloudRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dyvlnnly8/video/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1),
            );

            console.log("Upload progress:", percent);
            // setUploadProgress(percent); // React state
          },
        },
      );

      const cloudData = cloudRes.data;

      const videoUrl = cloudData.secure_url;

      const thumbnailUrl = videoUrl.replace(
        "/upload/",
        "/upload/so_1,w_400,h_600,c_fill,q_auto,f_jpg/",
      );

      return { videoUrl, thumbnailUrl };
      // const tags = tagsInput
      //   .split(",")
      //   .map((t) => t.trim())
      //   .filter(Boolean);
    } catch (err) {
      console.error(err);
    } finally {
    }
  };

  const [video, setVideo] = useState<File | null>(null);

  /* ================= UI ================= */

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("video/")) return;

    const url = URL.createObjectURL(file);

    // cleanup old preview
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setVideo(file);
    setPreview(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const [existingVideoUrl, setExistingVideoUrl] = useState<string | null>(null);
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<
    string | undefined
  >(undefined);

  const [projectId, setProjectId] = useState("");

  async function handleOpenEditProject(project: IProject) {
    setProjectId(project._id.toString());
    try {
      setForm({
        title: project.title || "",
        description: project.description || "",
        techStack: project.techStack?.join(", ") || "",
        githubUrl: project.githubUrl || "",
        liveUrl: project.liveUrl || "",
        category: project.category || "",
        difficultyLevel: project.difficultyLevel || "",
      });

      if (project.videoUrl) {
        setExistingVideoUrl(project.videoUrl || null);
        setPreview(project.videoUrl || null);
        setExistingThumbnailUrl(project.thumbnail);
        setVideo(null);
        //   const res = await fetch(project.videoUrl);
        //   const blob = await res.blob();

        //   const file = new File([blob], "project-video.mp4", {
        //     type: blob.type,
        //   });

        //   setVideo(file);
        //   setPreview(URL.createObjectURL(file));
      } else {
        setPreview("");
        setExistingVideoUrl("");
        setVideo(null);
      }

      setOpenEditProject(true);
    } catch (err) {
      console.error("Edit project load failed:", err);
    }
  }

  async function deleteVideoFromCloudinary(videoUrl: string) {
    try {
      const publicId = getPublicIdFromUrl(videoUrl);

      await axios.post("/api/delete", {
        publicId,
      });
    } catch (err) {
      console.error("Failed to delete video", err);
    }
  }

  const handleUpdateProject = async () => {
    setFormError(null);

    // 🔥 Validation layer
    if (!form.title.trim()) {
      // scrollToTop();
      return setFormError("Title is required");
    }

    // const isNewVideoUploaded = !!video;

    if (!existingVideoUrl && !video) {
      return setFormError("Project preview is required");
    }

    let videoUrl = existingVideoUrl;
    let thumbnailUrl = existingThumbnailUrl;

    console.log(existingVideoUrl, video, preview);
    if (video) {
      // 🧹 delete old video first
      if (existingVideoUrl) {
        try {
          await deleteVideoFromCloudinary(existingVideoUrl);
        } catch (e) {
          console.warn("Delete failed, continuing...");
        }
      }

      // 📤 upload new one
      const val = await uploadVideo();
      if (!val) {
        return setFormError("Video upload failed");
      }

      videoUrl = val.videoUrl;
      thumbnailUrl = val.thumbnailUrl;
    }

    try {
      const payload = {
        projectId,
        title: form.title,
        description: form.description,
        techStack: form.techStack
          ? form.techStack.split(",").map((t) => t.trim())
          : [],
        githubUrl: form.githubUrl,
        liveUrl: form.liveUrl,
        videoUrl: videoUrl,
        thumbnail: thumbnailUrl,
        category: form.category,
        difficultyLevel:
          form.difficultyLevel === "" ? undefined : form.difficultyLevel,
      };

      const res = await updateProject(payload);

      if (!res?.success) {
        throw new Error(res?.error || "Failed to create project");
      }

      // ⚡ Optimistic UI update
      setProjects((prev: any) =>
        prev.map((p: any) => (p._id === projectId ? { ...p, ...payload } : p)),
      );

      resetForm();
      setOpenEditProject(false);
    } catch (err: any) {
      setFormError(err.message || "Something went wrong");
      console.error(err);
    }
  };

  return (
    <div className="px-4 pb-6 flex flex-col gap-6">
      <h1 className="font-playfair text-slate-900 dark:text-slate-100 text-4xl italic leading-tight mb-2">
        Projects
      </h1>
      <div
        onClick={() => {
          resetForm();
          setVideo(null);
          setPreview("");
          setOpenCreateProject(true);
        }}
        className=" cursor-pointer w-full h-44 p-4 border rounded-md flex gap-2 flex-col items-center bg-background/90"
      >
        <p className="w-14 min-h-14 max-h-14 min-w-14 max-w-14 h-14 border rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
          <Plus size={24} />
        </p>
        <span className="text-muted-foreground text-center">
          Click to begin the process of showcasing your new project
        </span>
        <Button className="rounded-full max-w-fit">Create Project</Button>
      </div>

      {/* ================= CREATE MODAL ================= */}
      <Dialog open={openCreateProject} onOpenChange={setOpenCreateProject}>
        <DialogContent className="sm:max-w-xl min-h-fit">
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Build something cool. Show it off.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 h-full max-h-[65vh] overflow-y-auto">
            <Field>
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </Field>

            <Field>
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </Field>

            <Field>
              <Label>Tech Stack (comma separated)</Label>
              <Input
                value={form.techStack}
                onChange={(e) => handleChange("techStack", e.target.value)}
              />
            </Field>

            <div className="flex flex-col min-[500px]:flex-row gap-4">
              <Field>
                <Label>GitHub URL</Label>
                <Input
                  value={form.githubUrl}
                  onChange={(e) => handleChange("githubUrl", e.target.value)}
                />
              </Field>

              <Field>
                <Label>Live URL</Label>
                <Input
                  value={form.liveUrl}
                  onChange={(e) => handleChange("liveUrl", e.target.value)}
                />
              </Field>
            </div>

            <div className="flex flex-col min-[500px]:flex-row gap-4">
              <Field>
                <Label>Category</Label>
                <Input
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                />
              </Field>

              <Field>
                <Label>Difficulty</Label>
                <Select
                  value={form.difficultyLevel}
                  onValueChange={(val) => handleChange("difficultyLevel", val)}
                >
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue placeholder="Select a difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Difficulty</SelectLabel>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Project preview *</Label>
              <div
                className="border-2 border-dashed rounded-lg min-h-[350px] flex items-center justify-center relative cursor-pointer"
                onClick={() => {
                  if (!video) fileInputRef.current?.click();
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                {!preview && (
                  <p className="text-gray-500">
                    Drag & drop a video or click to upload
                  </p>
                )}

                {preview && (
                  <>
                    <video
                      src={preview}
                      controls
                      loop
                      className="w-full h-full object-contain rounded-lg"
                    />

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setVideo(null);
                        setPreview(null);
                        setExistingVideoUrl(null);
                        setExistingThumbnailUrl(undefined);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded"
                    >
                      X
                    </button>
                  </>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  hidden
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFile(e.target.files[0]);
                  }}
                />
              </div>
            </div>

            {/* 🔥 Error UI */}
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </DialogClose>

            <Button onClick={handleCreateProject} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= EDIT MODAL ================= */}
      <Dialog open={openEditProject} onOpenChange={setOpenEditProject}>
        <DialogContent className="sm:max-w-xl min-h-fit">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Build something cool. Show it off.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 h-full max-h-[65vh] overflow-y-auto">
            <Field>
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </Field>

            <Field>
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </Field>

            <Field>
              <Label>Tech Stack (comma separated)</Label>
              <Input
                value={form.techStack}
                onChange={(e) => handleChange("techStack", e.target.value)}
              />
            </Field>

            <div className="flex flex-col min-[500px]:flex-row gap-4">
              <Field>
                <Label>GitHub URL</Label>
                <Input
                  value={form.githubUrl}
                  onChange={(e) => handleChange("githubUrl", e.target.value)}
                />
              </Field>

              <Field>
                <Label>Live URL</Label>
                <Input
                  value={form.liveUrl}
                  onChange={(e) => handleChange("liveUrl", e.target.value)}
                />
              </Field>
            </div>

            <div className="flex flex-col min-[500px]:flex-row gap-4">
              <Field>
                <Label>Category</Label>
                <Input
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                />
              </Field>

              <Field>
                <Label>Difficulty</Label>
                <Select
                  value={form.difficultyLevel}
                  onValueChange={(val) => handleChange("difficultyLevel", val)}
                >
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue placeholder="Select a difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Difficulty</SelectLabel>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Project preview *</Label>
              <div
                className="border-2 border-dashed rounded-lg min-h-[350px] flex items-center justify-center relative cursor-pointer"
                onClick={() => {
                  if (!video) fileInputRef.current?.click();
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                {!preview && (
                  <p className="text-gray-500">
                    Drag & drop a video or click to upload
                  </p>
                )}

                {preview && (
                  <>
                    <video
                      src={preview}
                      controls
                      loop
                      className="w-full h-full object-contain rounded-lg"
                    />

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setVideo(null);
                        setPreview(null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded"
                    >
                      X
                    </button>
                  </>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  hidden
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFile(e.target.files[0]);
                  }}
                />
              </div>
            </div>

            {/* 🔥 Error UI */}
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => {
                  setOpenEditProject(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
            </DialogClose>

            <Button onClick={handleUpdateProject} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= PROJECT LIST ================= */}
      <div className="flex flex-col gap-2">
        <span>{`All Projects (${projects.length})`}</span>
        <div className="grid grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {(projects ?? []).map((project: any, i: number) => (
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

                <Button
                  className="absolute top-4 right-4 rounded-full h-8 w-8 flex items-center justify-center"
                  style={{ padding: 0 }}
                  onClick={() => handleOpenEditProject(project)}
                >
                  <Pencil />
                </Button>

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
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
