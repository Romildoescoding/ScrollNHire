"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import React, { useRef, useState } from "react";

const Dashboard = () => {
  const { data: session } = useSession();
  const [video, setVideo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadVideo = async () => {
    if (!video) return;
    if (!session?.user) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", video);
      formData.append("upload_preset", "reel_upload");

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/dyvlnnly8/video/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const cloudData = await cloudRes.json();
      console.log(cloudData);

      const videoUrl = cloudData.secure_url;

      await fetch("/api/reel", {
        method: "POST",
        body: JSON.stringify({
          studentId: session?.user?.id,
          videoUrl,
          caption: "",
          tags: [],
          duration: cloudData.duration,
        }),
      });

      reset();
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col flex-1 pt-2 px-4 py-6">
        <header className="text-center mb-8">
          <h1
            className={`font-playfair text-slate-900 dark:text-slate-100 text-4xl italic leading-tight mb-2`}
          >
            Share your Reel
          </h1>
        </header>

        <div
          className="border-2 border-dashed rounded-lg h-[350px] flex items-center justify-center relative cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
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
      </div>

      <div className="sticky grid grid-cols-2 gap-4 bottom-0 bg-background-light/80 backdrop-blur-md p-4 border-t">
        <Button onClick={reset} variant="outline" className="w-full">
          Cancel
        </Button>

        <Button
          onClick={uploadVideo}
          disabled={!video || loading}
          className="w-full"
        >
          Share
          {loading && (
            <span className="ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
        </Button>
      </div>
    </>
  );
};

export default Dashboard;
