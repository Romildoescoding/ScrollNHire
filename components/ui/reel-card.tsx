"use client";

import { SetStateAction, useEffect, useRef, useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  Heart,
  Loader2,
  MessageCircle,
  Send,
  Share,
  User2,
  Volume,
  Volume2,
  VolumeOff,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Input } from "./input";
import { formatCommentTime } from "@/app/_lib/actions";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
// import Image from "next/image";

interface User {
  _id: string;
  name: string;
  image: string;
  role: string;
}

interface Reel {
  _id: string;
  videoUrl: string;
  caption?: string;
  likesCount: number;
  commentsCount: number;
  user: User;
}

interface Comment {
  _id: string;
  text: string;
  userId: {
    name: string;
    image: string;
    role: string;
  };
}

export default function ReelCard({
  reel,
  isMuted,
  setIsMuted,
}: {
  reel: Reel;
  isMuted: boolean;
  setIsMuted: React.Dispatch<SetStateAction<boolean>>;
}) {
  const { data: session } = useSession();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(reel.likesCount);

  const [showLikeAnim, setShowLikeAnim] = useState(false);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLength, setcommentsLength] = useState(reel.commentsCount);
  const [loadingComments, setLoadingComments] = useState(false);

  const [commentText, setCommentText] = useState("");

  const [showFullCaption, setShowFullCaption] = useState(false);

  /* VIDEO AUTOPLAY */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoRef.current) return;

        if (entry.isIntersecting) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      },
      { threshold: 0.7 },
    );

    if (videoRef.current) observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, []);

  /* LIKE */
  const handleLike = async () => {
    if (!session?.user) {
      console.log("session.user doesnt exist");
      return;
    }
    const newLiked = !liked;

    setLiked(newLiked);
    setLikes((prev) => prev + (newLiked ? 1 : -1));

    setShowLikeAnim(true);

    setTimeout(() => setShowLikeAnim(false), 600);

    await fetch(`/api/reel/${reel._id}/like`, {
      method: "POST",
      body: JSON.stringify({
        userId: session.user.id,
      }),
    });
  };

  /* LOAD COMMENTS */
  const openComments = async () => {
    setCommentsOpen(true);
    try {
      setLoadingComments(true);
      const res = await fetch(`/api/reel/${reel._id}/comments`);
      const data = await res.json();
      setComments(data.comments);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingComments(false);
    }
  };

  /* ADD COMMENT */
  const submitComment = async () => {
    if (!session?.user) {
      console.log("session.user doesnt exist");
      return;
    }
    if (!commentText.trim()) return;

    try {
      const res = await fetch(`/api/reel/${reel._id}/comments`, {
        method: "POST",
        body: JSON.stringify({
          userId: session?.user?.id,
          text: commentText,
        }),
      });
      const result = await res.json();

      if (!result.success) {
        console.log(result.message);
        return;
      }

      const newComment = result.data;

      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
      setcommentsLength((c) => c + 1);
    } catch (err) {
      console.log(err);
    }
  };

  const [isShortlisted, setIsShortlisted] = useState(false);

  const toggleShortlist = async () => {
    if (!session?.user) return;
    try {
      const res = await fetch(`/api/reel/${reel._id}/shortlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employerId: session.user.id,
          studentId: reel.user._id,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setIsShortlisted(result.shortlisted);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex h-full justify-center w-full bg-background">
      {/* PHONE WIDTH CONTAINER */}
      <div className="relative w-[380px] h-full bg-background rounded-md overflow-hidden">
        {/* VIDEO */}
        <video
          ref={videoRef}
          src={reel.videoUrl}
          loop
          muted={isMuted}
          autoPlay
          playsInline
          className="h-full w-full object-cover"
          onDoubleClick={handleLike}
        />

        {/* DOUBLE TAP HEART */}
        <AnimatePresence>
          {showLikeAnim && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1.5 }}
              exit={{ scale: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Heart size={120} className="text-white fill-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* RIGHT ACTIONS */}

        <div className="absolute right-4 bottom-24 flex flex-col items-center gap-3 text-white">
          <button
            onClick={handleLike}
            className="cursor-pointer flex flex-col items-center"
          >
            <Heart
              size={24}
              className={liked ? "fill-red-500 text-red-500" : ""}
            />
            <span className="text-[10px]">{likes}</span>
          </button>

          <button
            onClick={openComments}
            className="cursor-pointer flex flex-col items-center"
          >
            <MessageCircle size={24} />
            <span className="text-[10px]">{commentsLength}</span>
          </button>

          {session?.user?.role === "employer" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleShortlist}
                  className="cursor-pointer flex flex-col items-center"
                >
                  {isShortlisted ? (
                    <BookmarkCheck size={24} />
                  ) : (
                    <Bookmark size={24} />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Shortlist student</p>
              </TooltipContent>
            </Tooltip>
          )}
          <button className="cursor-pointer flex flex-col items-center">
            <Send size={24} />
          </button>
        </div>

        {/* BOTTOM GRADIENT */}
        <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black via-black/60 to-transparent">
          {/* USER */}
          <div className="flex items-center gap-3 mb-2">
            <img
              src={reel.user.image}
              className="w-9 h-9 rounded-full object-cover"
            />

            <span className="font-semibold text-white">@{reel.user.name}</span>
          </div>

          {/* CAPTION */}
          <p
            onClick={() => setShowFullCaption(!showFullCaption)}
            className="text-white text-sm cursor-pointer"
          >
            {showFullCaption ? reel.caption : reel.caption?.slice(0, 80)}
          </p>
        </div>

        <button
          onClick={() => setIsMuted((muted) => !muted)}
          className="text-neutral-50 cursor-pointer absolute bottom-4 right-4 flex items-center justify-center h-8 w-8 rounded-full bg-neutral-950/50 hover:bg-neutral-700/50 transition-all border-none outline-none"
        >
          {!isMuted ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeOff className="h-4 w-4" />
          )}
        </button>

        {/* COMMENT DRAWER */}
        <AnimatePresence>
          {commentsOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="text-primary absolute bottom-0 left-0 w-full h-[60%] bg-background  rounded-t-2xl flex flex-col"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center p-4 border-b">
                <span className="font-semibold">Comments</span>

                <button onClick={() => setCommentsOpen(false)}>
                  <X />
                </button>
              </div>

              {/* COMMENT LIST */}

              {loadingComments && (
                <div className="h-full w-full flex items-center justify-center">
                  <Loader2 className="h-7 w-7 animate-spin" />
                </div>
              )}
              {!loadingComments && (
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {comments.map((c) => (
                    <div key={c._id} className="flex gap-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={c?.userId?.image ?? undefined}
                          alt="Avatar"
                        />
                        <AvatarFallback>
                          <User2 size={20} />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="flex gap-1 items-end font-semibold text-xs">
                          <span>{c?.userId?.name}</span>
                          <span className="text-primary/40">
                            {formatCommentTime(c.createdAt)}
                          </span>
                        </p>

                        <p className="text-xs text-primary">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* COMMENT INPUT */}
              <div className="p-3 border-t flex gap-2 items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={session?.user?.image ?? undefined}
                    alt="Avatar"
                  />
                  <AvatarFallback>
                    <User2 size={20} />
                  </AvatarFallback>
                </Avatar>
                <Input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 border rounded-full px-4 py-2 text-sm"
                />

                <button
                  onClick={submitComment}
                  className="text-blue-500 font-semibold"
                >
                  Post
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
