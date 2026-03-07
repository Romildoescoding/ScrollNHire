"use client";

import { useEffect, useState, useCallback } from "react";
import ReelCard from "@/components/ui/reel-card";

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
  viewsCount: number;
  user: User;
}

interface Cursor {
  createdAt: string;
  id: string;
}

export default function ReelFeed() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [cursor, setCursor] = useState<Cursor | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchReels = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    const params = new URLSearchParams();

    if (cursor) {
      params.append("cursorCreatedAt", cursor.createdAt);
      params.append("cursorId", cursor.id);
    }

    const res = await fetch(`/api/reel?${params.toString()}`);

    const data = await res.json();

    setReels((prev) => [...prev, ...data.reels]);

    if (data.nextCursor) {
      setCursor(data.nextCursor);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  }, [cursor, loading, hasMore]);

  useEffect(() => {
    fetchReels();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500
      ) {
        fetchReels();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchReels]);

  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="h-[calc(100vh-96px)] overflow-y-scroll snap-y snap-mandatory">
      {reels.map((reel) => (
        <div
          key={reel._id}
          className="h-full snap-start flex items-center justify-center"
        >
          <ReelCard isMuted={isMuted} setIsMuted={setIsMuted} reel={reel} />
        </div>
      ))}

      {loading && (
        <div className="text-white text-center py-4">Loading more reels...</div>
      )}
    </div>
  );
}
