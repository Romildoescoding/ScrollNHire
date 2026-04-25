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

  const isFetchingRef = useRef(false);
  const reelIdsRef = useRef(new Set<string>());

  const fetchReels = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;
    // console.log("FETCH REELS CALLED");

    isFetchingRef.current = true;
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

    const uniqueReels: Reel[] = [];

    for (const reel of data.reels) {
      if (!reelIdsRef.current.has(reel._id)) {
        reelIdsRef.current.add(reel._id);
        uniqueReels.push(reel);
      }
    }

    setReels((prev) => [...prev, ...uniqueReels]);

    // setReels((prev) => [...prev, ...data.reels]);
    // preventing dupliacates.. might need to fix this later on.
    // setReels((prev) => {
    //   const newReels = data.reels.filter(
    //     (r: Reel) => !prev.some((p) => p._id === r._id),
    //   );
    //   return [...prev, ...newReels];
    // });

    if (data.nextCursor) {
      setCursor(data.nextCursor);
    } else {
      setHasMore(false);
    }

    isFetchingRef.current = false;
    setLoading(false);
  }, [cursor, hasMore]); // ❌ removed initialReelId

  // preventing oldIds from getting new reels.
  useEffect(() => {
    setReels([]);
    setCursor(null);
    setHasMore(true);
    reelIdsRef.current.clear();
  }, [initialReelId]);

  useEffect(() => {
    fetchReels();
  }, []);

  // useEffect(() => {
  //   console.log("hasMore:", hasMore);
  //   console.log("cursor:", cursor);
  // }, [cursor, hasMore]);

  // refetching reels on scroll
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // console.log("🔥 OBSERVER TRIGGERED");
          fetchReels();
        }
      },
      {
        root: containerRef.current,
        threshold: 0.1,
      },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchReels, reels]); // 👈 IMPORTANT
  // useEffect(() => {
  //   const container = containerRef.current;
  //   if (!container) return;

  //   const handleScroll = () => {
  //     if (
  //       container.scrollTop + container.clientHeight >=
  //       container.scrollHeight - 300
  //     ) {
  //       fetchReels();
  //     }
  //   };

  //   container.addEventListener("scroll", handleScroll);

  //   return () => container.removeEventListener("scroll", handleScroll);
  // }, [fetchReels]);

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
      className="h-full min-[500px]:h-[calc(100vh-96px)] overflow-y-scroll snap-y snap-mandatory no-scrollbar"
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

      {loading &&
        Array.from({ length: 2 }).map((_, i) => (
          <div
            key={`skeleton-${i}`}
            className="h-full snap-start flex items-center justify-center"
          >
            <ReelSkeleton />
          </div>
        ))}
      <div ref={loadMoreRef} className="h-32 w-full" />
    </div>
  );
}

export const ReelSkeleton = () => {
  return (
    <div className="flex h-full justify-center w-full bg-background dark:dark:bg-[#0f0f12] animate-pulse">
      <div className="relative w-full max-w-fit aspect-[9/16] bg-black overflow-hidden rounded-none min-[500px]:rounded-lg">
        {/* fake video block */}
        <div className="absolute inset-0 shimmer" />

        {/* bottom overlay skeleton */}
        <div className="absolute bottom-4 left-3 right-3 space-y-3">
          {/* username */}
          <div className="h-4 w-24 shimmer rounded" />

          {/* caption lines */}
          <div className="h-3 w-40 shimmer rounded" />
          <div className="h-3 w-32 shimmer rounded" />
        </div>

        {/* right side actions (like, comment etc) */}
        <div className="absolute right-3 bottom-20 flex flex-col items-center gap-4">
          <div className="h-10 w-10 shimmer rounded-full" />
          <div className="h-10 w-10 shimmer rounded-full" />
          <div className="h-10 w-10 shimmer rounded-full" />
          <div className="h-10 w-10 shimmer rounded-full" />
        </div>
      </div>
    </div>
  );
};
