"use client";

import { useEffect, useState, useCallback } from "react";
import ReelCard from "@/components/ui/reel-card";

interface Student {
  _id: string;
  skills: string[];
  verified: boolean;
  user: {
    name: string;
    image: string;
  };
}

interface Reel {
  _id: string;
  videoUrl: string;
  caption?: string;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  student: Student;
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

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {reels.map((reel) => (
        <div
          key={reel._id}
          className="h-screen snap-start flex items-center justify-center"
        >
          <ReelCard reel={reel} />
        </div>
      ))}

      {loading && (
        <div className="text-white text-center py-4">Loading more reels...</div>
      )}
    </div>
  );
}
