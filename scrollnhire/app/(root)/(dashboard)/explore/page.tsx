"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface User {
  _id: string;
  name: string;
  image: string;
  role: string;
}

interface Reel {
  _id: string;
  thumbnailUrl: string;
  videoUrl: string; // ✅ needed for preview
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

export default function ExplorePage() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [cursor, setCursor] = useState<Cursor | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [query, setQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [activeMobileIndex, setActiveMobileIndex] = useState<number | null>(
    null,
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // detect mobile
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const isFetchingRef = useRef(false);

  const fetchReels = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;
    setLoading(true);

    const params = new URLSearchParams();

    if (cursor) {
      params.append("cursorCreatedAt", cursor.createdAt);
      params.append("cursorId", cursor.id);
    }

    if (query) {
      params.append("search", query);
    }

    const res = await fetch(`/api/reel?${params.toString()}`);
    const data = await res.json();

    setReels((prev) => [...prev, ...data.reels]);

    //     setReels((prev) => {
    //   const map = new Map(prev.map((r) => [r._id, r]));
    //   data.reels.forEach((r: Reel) => map.set(r._id, r));
    //   return Array.from(map.values());
    // });

    if (data.nextCursor) {
      setCursor(data.nextCursor);
    } else {
      setHasMore(false);
    }

    isFetchingRef.current = false;
    setLoading(false);
  }, [cursor, hasMore, query]);

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const hasInitialLoadRef = useRef(false);

  // Proper reset before fresh fetch for page mount or navigation back.

  useEffect(() => {
    if (isInitialLoad) {
      setReels([]);
      setCursor(null);
      setHasMore(true);
      setIsInitialLoad(false);
    }
  }, [isInitialLoad]);

  // DEBUG..
  useEffect(() => {
    console.log("FETCHING WITH CURSOR:", cursor);
    console.log("REELS LENGTH:", reels.length);
  }, [cursor, reels.length]);

  useEffect(() => {
    setReels([]);
    setCursor(null);
    setHasMore(true);
  }, [query]);

  useEffect(() => {
    fetchReels();
  }, [fetchReels]);

  useEffect(() => {
    if (reels.length > 0) {
      hasInitialLoadRef.current = true;
    }
  }, [reels]);

  // infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !hasInitialLoadRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      if (scrollTop + clientHeight >= scrollHeight - 300) {
        console.log("FETCHING REELS THROUGH THE INFINITE SCROLL");
        fetchReels();
      }
    };

    const container = containerRef.current;
    container?.addEventListener("scroll", handleScroll);

    return () => container?.removeEventListener("scroll", handleScroll);
  }, [fetchReels]);

  // 🎲 pick random reel for mobile autoplay
  useEffect(() => {
    if (isMobile && reels.length > 0) {
      const randomIndex = Math.floor(Math.random() * reels.length);
      setActiveMobileIndex(randomIndex);
    }
  }, [reels, isMobile]);

  return (
    <div className="h-[calc(100vh-96px)] flex flex-col">
      {/* 🔍 SEARCH */}
      <div className="p-4 border-b border-neutral-800">
        <input
          type="text"
          placeholder="Search skills, roles, tech..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 rounded-xl bg-neutral-900 text-white outline-none"
        />
      </div>

      {/* 🧱 GRID */}
      <div ref={containerRef} className="flex-1 overflow-y-scroll p-3">
        <div className="columns-2 md:columns-3 gap-3 space-y-3">
          {reels.map((reel, index) => {
            const isSquare = index % 5 === 0;
            const isActiveMobile = isMobile && index === activeMobileIndex;

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
                  className={`w-full object-cover transition duration-500 blur-sm group-hover:blur-0 ${
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

                {/* 📱 MOBILE RANDOM AUTOPLAY */}
                {isActiveMobile && (
                  <video
                    src={reel.videoUrl}
                    muted
                    autoPlay
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                {/* overlay */}
                <div className="absolute bottom-2 left-2 right-2 text-white text-xs z-10">
                  <p className="font-semibold truncate">{reel.user.name}</p>
                  <p className="truncate opacity-70">{reel.caption}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ⏳ loader */}
        {loading && (
          // <div className="h-[calc(100vh-56px)] w-full flex items-center justify-center">
          <div className="h-fit w-full flex items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
        )}

        {!hasMore && (
          <div className="text-center text-neutral-500 py-4">{`That's it for the reels`}</div>
        )}
      </div>
    </div>
  );
}
