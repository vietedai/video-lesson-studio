import { useCallback, useEffect, useState } from "react";

export type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  lessonCount: number;
  status: "draft" | "ready";
};

const STORAGE_KEY = "vtc-projects";

export const defaultProjects: Project[] = [
  {
    id: "p-demo",
    name: "Toán 4 – Chương 1",
    description: "Các bài giảng chữa bài và luyện tập đầu năm.",
    createdAt: "2026-08-12",
    lessonCount: 3,
    status: "ready",
  },
];

export function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("vi-VN");
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setProjects(JSON.parse(saved) as Project[]);
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  const persist = useCallback((next: Project[]) => {
    setProjects(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const createProject = useCallback(
    (name: string, description = "") => {
      const project: Project = {
        id: `p-${Date.now().toString(36)}`,
        name,
        description,
        createdAt: new Date().toISOString().slice(0, 10),
        lessonCount: 0,
        status: "draft",
      };
      persist([project, ...projects]);
      return project;
    },
    [projects, persist],
  );

  const updateProject = useCallback(
    (id: string, patch: Partial<Project>) =>
      persist(projects.map((p) => (p.id === id ? { ...p, ...patch } : p))),
    [projects, persist],
  );

  const deleteProject = useCallback(
    (id: string) => persist(projects.filter((p) => p.id !== id)),
    [projects, persist],
  );

  return { projects, loaded, createProject, updateProject, deleteProject };
}
