"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import ReelCard from "@/components/ui/reel-card";
import { useRouter } from "next/navigation";

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
  isShortlisted: boolean;
  isLiked: boolean;
}

interface Cursor {
  createdAt: string;
  id: string;
}

export default function ReelFeed({
  initialReelId,
}: {
  initialReelId?: string;
}) {
  const [reels, setReels] = useState<Reel[]>([]);
  const [cursor, setCursor] = useState<Cursor | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  const currentReelRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reels.length === 0) return;

    const firstReelId = reels[0]._id;

    // only update if URL is still /reels
    if (window.location.pathname === "/reels") {
      window.history.replaceState(null, "", `/reels/${firstReelId}`);
    }
  }, [reels]);

  useEffect(() => {
    const elements = document.querySelectorAll("[data-reel-id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const reelId = entry.target.getAttribute("data-reel-id");

            if (reelId && currentReelRef.current !== reelId) {
              currentReelRef.current = reelId;

              window.history.replaceState(null, "", `/reels/${reelId}`);
            }
          }
        });
      },
      { threshold: 0.7 },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [reels, router]);

  const fetchReels = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    const params = new URLSearchParams();

    // ✅ ONLY first fetch
    if (!cursor && initialReelId) {
      params.append("initialReelId", initialReelId);
    }

    // ✅ pagination
    if (cursor) {
      params.append("cursorCreatedAt", cursor.createdAt);
      params.append("cursorId", cursor.id);
    }

    const res = await fetch(`/api/reel?${params.toString()}`);
    const data = await res.json();

    // setReels((prev) => [...prev, ...data.reels]);
    // preventing dupliacates.. might need to fix this later on.
    setReels((prev) => {
      const newReels = data.reels.filter(
        (r: Reel) => !prev.some((p) => p._id === r._id),
      );
      return [...prev, ...newReels];
    });

    if (data.nextCursor) {
      setCursor(data.nextCursor);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  }, [cursor, loading, hasMore]); // ❌ removed initialReelId

  useEffect(() => {
    fetchReels();
  }, []);

  // refetching reels on scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 300
      ) {
        fetchReels();
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => container.removeEventListener("scroll", handleScroll);
  }, [fetchReels]);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (
  //       window.innerHeight + window.scrollY >=
  //       document.body.offsetHeight - 500
  //     ) {
  //       fetchReels();
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [fetchReels]);

  const [isMuted, setIsMuted] = useState(false);

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-96px)] overflow-y-scroll snap-y snap-mandatory no-scrollbar"
    >
      {reels.map((reel) => (
        <div
          key={reel._id}
          data-reel-id={reel._id} // for updating the url
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
