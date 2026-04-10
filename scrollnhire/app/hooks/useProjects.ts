import { useCallback, useEffect, useState } from "react";
import { IProject } from "../models/ProjectModel";

export default function useProjects() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/projects`, {
        credentials: "include",
      });

      const data: {
        success: boolean;
        data: IProject[];
      } = await res.json();

      setProjects(data.data || []);
    } catch (err) {
      console.error(err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // initial fetch
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    refetch: fetchProjects,
    setProjects,
    loading,
  };
}
