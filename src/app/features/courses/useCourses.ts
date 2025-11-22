import { useMemo, useState } from "react";

export type Course = {
  id: string;
  title: string;
  status: "published" | "draft";
  studentsCount: number;
  lessonsCount: number;
  earningsCents?: number;
  updatedAt: string;
};

const MOCK_COURSES: Course[] = Array.from({ length: 28 }).map((_, i) => {
  const isPublished = i % 3 !== 0;
  return {
    id: String(i + 1),
    title: `Course ${i + 1} — Building features with React`,
    status: isPublished ? "published" : "draft",
    studentsCount: Math.floor(Math.random() * 500),
    lessonsCount: Math.floor(Math.random() * 40) + 1,
    earningsCents: isPublished ? Math.floor(Math.random() * 100000) : 0,
    updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
  };
});

export function useCourses(initialPerPage = 8) {
  const [filter, setFilter] = useState<"all" | "published" | "drafts">("all");
  const [page, setPage] = useState(1);
  const perPage = initialPerPage;

  const filtered = useMemo(() => {
    if (filter === "all") return MOCK_COURSES;
    return MOCK_COURSES.filter((c) =>
      filter === "published" ? c.status === "published" : c.status === "draft"
    );
  }, [filter]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page, perPage]);

  const setFilterAndReset = (f: typeof filter) => {
    setFilter(f);
    setPage(1);
  };

  return {
    courses: paginated,
    page,
    setPage,
    perPage,
    total,
    totalPages,
    filter,
    setFilter: setFilterAndReset,
  };
}
