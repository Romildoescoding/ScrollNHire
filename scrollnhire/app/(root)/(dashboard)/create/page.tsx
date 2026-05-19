"use client";

import { useUploadProgress } from "@/app/context/ReelUploadContext";
import { Button } from "@/components/ui/button";
import TagsInput from "@/components/ui/tags-input";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import posthog from "posthog-js";

const Create = () => {
  const { data: session } = useSession();
  useEffect(() => {
    console.log("session ->");
    console.log(session);
  }, [session]);

  const { setUploadProgress } = useUploadProgress();

  const [video, setVideo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [tags, setTags] = useState<string[]>([]);

  const [caption, setCaption] = useState("");
  // const [tagsInput, setTagsInput] = useState("");

  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------------- FILE HANDLING ---------------- */

  const handleFile = (file: File) => {
    if (!file.type.startsWith("video/")) return;

    setVideo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const reset = () => {
    setVideo(null);
    setPreview(null);
    setCaption("");
    setTags([]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ---------------- UPLOAD ---------------- */

  const uploadVideo = async () => {
    if (!video || !caption.trim()) return;
    if (!session?.user) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", video);
      formData.append("upload_preset", "reel_upload");

      const cloudRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dyvlnnly8/video/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1),
            );

            console.log("Upload progress:", percent);
            setUploadProgress(percent); // React state
          },
        },
      );

      const cloudData = cloudRes.data;

      const videoUrl = cloudData.secure_url;

      const thumbnailUrl = videoUrl.replace(
        "/upload/",
        "/upload/so_1,w_400,h_600,c_fill,q_auto,f_jpg/",
      );
      // const tags = tagsInput
      //   .split(",")
      //   .map((t) => t.trim())
      //   .filter(Boolean);

      await fetch("/api/reel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          videoUrl,
          thumbnailUrl,
          caption: caption.trim(),
          tags,
          duration: cloudData.duration,
        }),
      });

      posthog.capture("reel_uploaded", {
        tags,
        duration: cloudData.duration,
        caption_length: caption.trim().length,
      });

      reset();
    } catch (err) {
      console.error(err);
    } finally {
      setUploadProgress(-1);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col flex-1 pt-2 px-4 py-6 space-y-6">
        <header className="text-center mb-4">
          <h1 className="font-playfair text-slate-900 dark:text-slate-100 text-4xl italic leading-tight mb-2">
            Share your Reel
          </h1>
        </header>

        {/* VIDEO UPLOAD AREA */}

        <div
          className="border-2 border-dashed rounded-lg h-[350px] flex items-center justify-center relative cursor-pointer"
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
                  reset();
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

        {/* CAPTION */}

        <div className="flex flex-col gap-2">
          <label className="text-md font-medium">Caption *</label>

          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write something about your reel..."
            className="border rounded-md p-3 min-h-[100px] resize-none"
            required
          />
        </div>

        {/* TAGS */}

        <TagsInput tags={tags} setTags={setTags} />
      </div>

      {/* ACTION BAR */}

      <div className="sticky grid grid-cols-2 gap-4 bottom-0 bg-background-light/80 backdrop-blur-md p-4 border-t">
        <Button onClick={reset} variant="outline" className="w-full">
          Cancel
        </Button>

        <Button
          onClick={uploadVideo}
          disabled={!video || !caption.trim() || loading}
          className="w-full"
        >
          Share
          {loading && (
            <span className="ml-2 w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></span>
          )}
        </Button>
      </div>
    </>
  );
};

export default Create;
