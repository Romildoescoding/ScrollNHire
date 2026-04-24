"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ArrowUpDown,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import SearchResults from "@/components/search-results";
import { unique } from "next/dist/build/utils";
import { useSidebar } from "@/app/context/SidebarContext";
import { cn } from "@/lib/utils";

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

    // if (query) {
    //   params.append("search", query);
    // }

    // if (type) params.append("type", type);
    // if (sort) params.append("sort", sort);
    // if (selectedTags.length > 0) {
    //   params.append("tags", selectedTags.join(","));
    // }

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
  }, [cursor, hasMore]);
  // }, [cursor, hasMore, query]);

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

  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    if (isSearchActive) return;
    fetchReels();
  }, [fetchReels, isSearchActive]);

  useEffect(() => {
    if (reels.length > 0) {
      hasInitialLoadRef.current = true;
    }
  }, [reels]);

  // infinite scroll
  useEffect(() => {
    if (isSearchActive) return;
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

  const { isSidebarOpen } = useSidebar();

  // SEARCHING ENGINE

  const [type, setType] = useState<"reels" | "profiles" | "projects" | "all">(
    "all",
  );
  const [sort, setSort] = useState<"trending" | "latest" | "most_liked">(
    "trending",
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const uniqueTags = useRef(new Set<string>());
  const [tagInput, setTagInput] = useState<string>("");

  const [showTagAndFilter, setShowTagAndFilter] = useState(true);

  return (
    <div className="h-[calc(100vh-96px)] flex flex-col">
      <div className="relative flex flex-col gap-2 border-b">
        <div className="flex items-center px-2 pr-4">
          {isSearchActive && (
            <Button
              variant="outline"
              onClick={() => {
                setIsSearchActive(false);
                setQuery("");
              }}
            >
              <ArrowLeft />
            </Button>
          )}
          <div className="p-4 w-full">
            <Input
              type="text"
              placeholder="What's on your mind?"
              value={query}
              onFocus={() => setIsSearchActive(true)}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full"
              // className="w-full p-3 outline-none"
            />
          </div>
          {(selectedTags.length || query) && (
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => {
                setType("all");
                setSort("trending");
                setSelectedTags([]);
                setQuery("");
              }}
            >
              Clear All
            </Button>
          )}
        </div>

        {/* FILTERS and SORTING */}
        {isSearchActive && (
          <div className="space-y-4 w-full px-2 pr-4">
            {/* 🔹 TYPE TABS */}
            <Tabs
              className="w-full"
              value={type}
              onValueChange={(val) => setType(val as any)}
            >
              <TabsList className="w-full dark:bg-zinc-900">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="reels">Reels</TabsTrigger>
                <TabsTrigger value="profiles">Profiles</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* 🔹 SORT OPTIONS */}
            {showTagAndFilter && (
              <div
                className={cn(
                  "flex flex-col md:flex-row gap-2 items-end md:items-center w-full justify-between",
                  isSidebarOpen
                    ? "min-[900px]:flex-row min-[900px]:items-center"
                    : "md:flex-row md:items-center",
                )}
              >
                <div
                  className={cn(
                    "order-2 w-full space-y-2",
                    isSidebarOpen ? "min-[900px]:order-1" : "md:order-1",
                  )}
                >
                  <Label>Tags</Label>

                  <div className="max-w-fit border rounded-lg p-2 flex gap-2">
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tag) => (
                        <Badge
                          key={tag}
                          className=" rounded-full flex items-center gap-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation(); // 🛑 prevent weird bubbling issues

                              const filteredTags = selectedTags.filter(
                                (t) => t !== tag,
                              );

                              setSelectedTags(filteredTags);
                            }}
                            className="ml-1 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="You can add upto 5 tags"
                        value={tagInput}
                        className="border-none ourline-none"
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();

                            if (selectedTags.length >= 5) return;

                            const normalized = tagInput.trim().toLowerCase();

                            if (
                              !normalized ||
                              selectedTags.includes(normalized)
                            )
                              return;

                            setSelectedTags((prev) => [...prev, normalized]);

                            setTagInput("");
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className={cn(
                    "order-1 flex gap-2 items-center",
                    isSidebarOpen ? "min-[900px]:order-2" : "md:order-2",
                  )}
                >
                  <Label>
                    <ArrowUpDown className="text-muted-foreground" size={18} />
                  </Label>
                  <Select
                    value={sort}
                    onValueChange={(val) => setSort(val as any)}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>

                    <SelectContent className="">
                      <SelectItem value="trending">Trending</SelectItem>
                      <SelectItem value="latest">Latest</SelectItem>
                      <SelectItem value="most_liked">Most Liked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        )}

        {isSearchActive && (
          <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
            <Button
              className="h-10 w-10 rounded-full flex items-center justfiy-center"
              style={{ padding: 0 }}
              variant="outline"
              onClick={() => setShowTagAndFilter((show) => !show)}
            >
              {showTagAndFilter ? <ArrowUp /> : <ArrowDown />}
            </Button>
          </div>
        )}
      </div>

      {isSearchActive && (
        <SearchResults
          query={query}
          sort={sort}
          selectedTags={selectedTags}
          type={type}
          searchIsActive={isSearchActive}
        />
      )}

      {/* 🧱 GRID */}

      {isSearchActive && !query && (
        <div className="p-4">
          <p className="text-sm text-zinc-400 mb-2">Suggestions</p>

          <div className="flex text-x min-[400px]:text-sm min-[550px]:text-base flex-col">
            {[
              "Software Engineer with 4+ years of experience",
              "React developers with the knowledge of AI",
              "Graduates with a strong knowledge of Data Structures",
              "Full-Stack Developers based in Singapore",
            ].map((suggestion) => (
              <p
                key={suggestion}
                className="cursor-pointer flex items-center gap-4 max-[399px]:p-0 p-2"
                onClick={() => setQuery(suggestion)}
              >
                <span className="flex items-center justify-center border rounded-full h-10 w-10">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </span>
                {suggestion}
              </p>
            ))}
          </div>
        </div>
      )}

      {!isSearchActive && (
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
      )}
    </div>
  );
}
