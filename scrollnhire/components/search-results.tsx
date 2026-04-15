import { IProject } from "@/app/models/ProjectModel";
import { Loader2 } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
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

  return (
    <div ref={containerRef} className="flex-1 overflow-y-scroll p-4">
      {loading && (
        <div className="flex justify-center py-4">
          <Loader2 className="animate-spin" />
        </div>
      )}

      {reels.length > 0 && (
        <div className="mb-6">
          <h2 className="text-white font-semibold mb-3">Reels</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {reels.map((reel) => (
              <div key={reel._id} className="rounded-xl overflow-hidden">
                <video
                  src={reel.videoUrl}
                  className="w-full h-full object-cover"
                  muted
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {profiles.length > 0 && (
        <div className="mb-6">
          <h2 className="text-white font-semibold mb-3">Profiles</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {profiles.map((profile) => (
              <div key={profile._id} className="p-4 bg-neutral-900 rounded-xl">
                <img
                  src={profile.userId?.image}
                  className="w-10 h-10 rounded-full mb-2"
                />

                <p className="text-white font-medium">{profile.userId?.name}</p>

                <div className="flex flex-wrap gap-1 mt-2">
                  {profile.skills?.slice(0, 3).map((skill: string) => (
                    <span
                      key={skill}
                      className="text-xs bg-neutral-800 px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-white font-semibold mb-3">Projects</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div key={project._id} className="p-4 bg-neutral-900 rounded-xl">
                <p className="text-white font-semibold">{project.title}</p>

                <div className="flex flex-wrap gap-1 mt-2">
                  {project.techStack?.slice(0, 3).map((tech: string) => (
                    <span
                      key={tech}
                      className="text-xs bg-neutral-800 px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
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
