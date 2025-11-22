import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { useMemo } from "react";
import { toast } from "react-toastify";
import { Course } from "../../app/api/instructor/instructor.type";

export const handleApiError = (
  err: unknown,
  fallbackMessage = "Something went wrong"
) => {
  const error = err as {
    status?: number;
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };

  if (error?.status === 422 && error?.data?.errors) {
    const firstError = Object.values(error.data.errors)[0][0];
    toast.error(firstError);
  } else if (error?.data?.message) {
    toast.error(error.data.message);
  } else {
    toast.error(fallbackMessage);
  }

  console.error("API Error:", error, fallbackMessage);
};


export function isFetchBaseQueryError(
  error: unknown
): error is FetchBaseQueryError & { data?: { message?: string } } {
  return typeof error === "object" && error != null && "status" in error;
}



export const levels = [
  { value: "", label: "All Levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export const languages = [
  { value: "", label: "All Languages" },
  { value: "English", label: "English" },
  { value: "German", label: "German" },
];

export const publishOptions = [
  { value: "0", label: "Draft" },
  { value: "1", label: "Published" },
];





// the coursePage logic :


export function useCourseParams({
  search,
  level,
  language,
  categoryId,
  instructorId,
}: {
  search: string;
  level: string;
  language: string;
  categoryId: number | null;
  instructorId?: number;
}) {
  return useMemo(() => {
    return {
      ...(search && { search }),
      ...(level && { level }),
      ...(language && { language }),
      ...(categoryId && { category_id: categoryId }),
      ...(instructorId && { instructor_id: instructorId }),
    };
  }, [search, level, language, categoryId, instructorId]);
}

export function useCourseCategories(courses: Course[]) {
  return useMemo(() => {
    const map = new Map<number, string>();
    courses.forEach((c) => {
      if (c.category) {
        map.set(c.category.id, c.category.title);
      }
    });

    const dynamicCategories = Array.from(map, ([id, title]) => ({
      value: id,
      label: title,
    }));

    return [{ value: null, label: "All Categories" }, ...dynamicCategories];
  }, [courses]);
}
