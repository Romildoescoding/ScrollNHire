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
import axios from "axios";

import { ExternalLink, Pencil } from "lucide-react";
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
    <>
      {/* CREATE PROJECT BUTTON */}
      <div className="mb-4">
        <Button
          onClick={() => {
            resetForm();
            setVideo(null);
            setPreview("");
            setOpenCreateProject(true);
          }}
        >
          + Create Project
        </Button>
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

            <div className="flex gap-4">
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

            <div className="flex gap-4">
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

            <div className="flex gap-4">
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

            <div className="flex gap-4">
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
      <div className="grid grid-cols-4 gap-4">
        {(projects ?? []).map((project: any, i: number) => (
          <Card key={i}>
            <CardContent className="text-sm flex flex-col gap-2">
              <div className="w-full h-fit">
                <Image
                  src={project.thumbnail || "/placeholder.png"}
                  className="w-full rounded-md"
                  alt="project_image"
                  height={500}
                  width={500}
                />
              </div>

              <Badge onClick={() => handleOpenEditProject(project)}>
                <Pencil />
              </Badge>

              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-base">{project.title}</div>
                  <div className="text-muted-foreground">
                    {project.description}
                  </div>
                </div>

                {project.liveUrl && (
                  <Link href={project.liveUrl} target="_blank">
                    <ExternalLink size={18} />
                  </Link>
                )}
              </div>

              {/* Tech stack badges */}
              <div className="flex flex-wrap gap-2">
                {(project.techStack || []).map((tech: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-xs bg-muted px-2 py-1 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default ProjectPage;
