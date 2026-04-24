import { IProject } from "@/app/models/ProjectModel";
import { ExternalLink, Loader2, User2 } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/app/context/SidebarContext";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

const SearchResults = ({
  query,
  type,
  sort,
  selectedTags,
  searchIsActive,
}: {
  query: string;
  type: "reels" | "profiles" | "projects" | "all";
  sort: "trending" | "latest" | "most_liked";
  selectedTags: string[];
  searchIsActive: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [reels, setReels] = useState<Reel[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);

  const [cursor, setCursor] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const isFetchingRef = useRef(false);

  const fetchSearchResults = async (reset = false) => {
    if (!query.trim()) {
      setReels([]);
      setProfiles([]);
      setProjects([]);
      return;
    }

    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);

    const params = new URLSearchParams();

    params.append("query", query);
    params.append("type", type);
    params.append("sort", sort);

    if (selectedTags.length > 0) {
      params.append("tags", selectedTags.join(","));
    }

    if (!reset && cursor) {
      params.append("cursorScore", cursor.score);
      params.append("cursorId", cursor.id);
    }

    const res = await fetch(`/api/search?${params.toString()}`);
    const data = await res.json();

    if (reset) {
      setReels(data.reels || []);
      setProfiles(data.accounts || []);
      setProjects(data.projects || []);
    } else {
      setReels((prev) => [...prev, ...(data.reels || [])]);
      setProfiles((prev) => [...prev, ...(data.accounts || [])]);
      setProjects((prev) => [...prev, ...(data.projects || [])]);
    }

    if (data.nextCursor) {
      setCursor(data.nextCursor);
    } else {
      setHasMore(false);
    }

    isFetchingRef.current = false;
    setLoading(false);
  };

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const hasFetchedOnceRef = useRef(false);

  useEffect(() => {
    if (!searchIsActive || !query.trim()) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      // 🔥 reset + fetch fresh
      setCursor(null);
      setHasMore(true);

      fetchSearchResults(true); // reset = true
    }, 400);
  }, [query, selectedTags, type, sort, searchIsActive]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      if (
        scrollTop + clientHeight >= scrollHeight - 300 &&
        !loading &&
        hasMore
      ) {
        fetchSearchResults(false); // load more
      }
    };

    const container = containerRef.current;
    container?.addEventListener("scroll", handleScroll);

    return () => container?.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  const { isSidebarOpen } = useSidebar();
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-scroll p-4">
      {loading && (
        <div className="flex justify-center py-4">
          <Loader2 className="animate-spin" />
        </div>
      )}

      {reels.length > 0 && (
        <div className="mb-6">
          <h2 className=" font-semibold mb-3">Reels</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {reels.map((reel) => (
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
                  className={`w-full object-cover transition duration-500  ${
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

                {/* overlay */}
                <div className="absolute bottom-2 left-2 right-2 text-white text-sm z-10">
                  {/* <p className="font-semibold truncate">{reel.user.name}</p> */}
                  <p className="truncate opacity-70">{reel.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {profiles.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold mb-3">Profiles</h2>

          <div
            className={cn(
              "grid grid-cols-1 min-[545px]:grid-cols-2  gap-4",
              isSidebarOpen
                ? "lg:grid-cols-3 xl:grid-cols-4"
                : "md:grid-cols-3 xl:grid-cols-4",
            )}
          >
            {profiles.map((profile) => (
              <div
                key={profile._id}
                onClick={() => router.push(`/profile/${profile.userId}`)}
                className="bg-white cursor-pointer dark:bg-zinc-950 rounded-lg p-2 flex items-center justify-center border shadow-sm"
              >
                <div className="flex w-full flex-col gap-2">
                  <div className="flex gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile.image ?? undefined} />
                      <AvatarFallback>
                        <User2 size={20} />
                      </AvatarFallback>
                    </Avatar>

                    <div className="text-xs">
                      <div className="font-medium">{profile.name}</div>
                      <div className="text-muted-foreground">
                        {profile.degree} {profile.branch}
                      </div>
                    </div>
                  </div>
                  {profile.skills.length > 0 && (
                    <div className="flex gap-2">
                      {profile.skills.slice(0, 4).map((skill, i) => (
                        <Badge key={i} className="rounded-full text-[10px]">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold mb-3">Projects</h2>

          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 gap-4">
            {projects.map((project, i) => (
              <Card
                className="relative py-2 flex flex-col justify-between"
                key={i}
              >
                <CardContent className="text-sm flex flex-col gap-2 px-2">
                  <div className="w-full h-fit">
                    <Image
                      src={project.thumbnail || "/placeholder.png"}
                      className="w-full rounded-md"
                      alt="project_image"
                      height={500}
                      width={500}
                    />
                  </div>

                  {/* <Button
                  className="absolute top-4 right-4 rounded-full h-8 w-8 flex items-center justify-center"
                  style={{ padding: 0 }}
                  onClick={() => handleOpenEditProject(project)}
                >
                  <Pencil />
                </Button> */}

                  <div className="flex flex-col">
                    <span></span>
                    <div className="flex justify-between w-full">
                      <div className="font-semibold flex-1 max-w-[80%] text-base">
                        {project.title}
                      </div>
                      {/* {project.liveUrl && ( */}
                      <Button
                        variant="outline"
                        className="rounded-full h-8 min-w-8 w-8 flex items-center justify-center"
                        style={{ padding: 0 }}
                        disabled={!project.liveUrl}
                      >
                        <Link
                          href={project.liveUrl ?? "/projects"}
                          target="_blank"
                          className="min-w-fit"
                        >
                          <ExternalLink size={18} />
                        </Link>
                      </Button>
                      {/* )} */}
                    </div>
                    <div className="text-muted-foreground">
                      {project.description}
                    </div>
                  </div>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-2">
                    {(project.techStack || []).map(
                      (tech: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-xs bg-muted px-2 py-1 rounded-full"
                        >
                          {tech}
                        </span>
                      ),
                    )}
                  </div>
                </CardContent>
                <p className="flex w-full justify-end p-2 pb-0">
                  <Badge
                    className={cn(
                      "flex rounded-full items-center gap-2 p-1 capitalize",
                      project.difficultyLevel === "advanced"
                        ? "bg-red-300 text-red-600"
                        : project.difficultyLevel === "intermediate"
                          ? "bg-blue-300 text-blue-600"
                          : "bg-green-300 text-green-600",
                    )}
                  >
                    <span
                      className={cn(
                        "flex w-3 h-3 rounded-full",
                        project.difficultyLevel === "advanced"
                          ? "bg-red-500"
                          : project.difficultyLevel === "intermediate"
                            ? "bg-blue-500"
                            : "bg-green-500",
                      )}
                    ></span>
                    {project.difficultyLevel ?? "Beginner"}
                  </Badge>
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!loading &&
        query &&
        reels.length === 0 &&
        profiles.length === 0 &&
        projects.length === 0 && (
          <div className="text-center text-neutral-500 py-10">
            No results found
          </div>
        )}
    </div>
  );
};

export default SearchResults;
