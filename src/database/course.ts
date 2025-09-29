import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase.js";
import type { Course, CourseListQuery, NewCourse } from "../types/course.d.js";
import type { PaginatedListResponse } from "../types/global.js";

export async function getCourses(
  query: CourseListQuery
): Promise<PaginatedListResponse<Course>> {
  // Säkerhetskontroll för sortering
  const sortable = new Set(["title", "start_date"]);
  const order = query.sort_by
    ? sortable.has(query.sort_by)
      ? query.sort_by
      : "title"
    : "title";

  // Beräkna paginering
  const startIndex = query.offset || 0;
  const endIndex = startIndex + (query.limit || 10) - 1;

  // Bygg grundläggande query
  const _query = supabase
    .from("courses")
    .select("*", { count: "exact" })
    .order(order, { ascending: true })
    .range(startIndex, endIndex);

  // Lägg till filter för avdelning
  if (query.department) {
    _query.eq("department", query.department);
  }

  // Lägg till textsökning
  if (query.q) {
    // Sök i title och description
    _query.or(`title.ilike.%${query.q}%,description.ilike.%${query.q}%`);
  }

  // Utför query
  const courses: PostgrestSingleResponse<Course[]> = await _query;

  // Returnera paginerat svar
  return {
    data: courses.data || [],
    count: courses.count || 0,
    offset: query.offset || 0,
    limit: query.limit || 10,
  };
}

export async function createCourse(course: NewCourse): Promise<Course> {
  const query = supabase.from("courses").insert(course).select().single();
  const response: PostgrestSingleResponse<Course> = await query;
  return response.data!;
}

export async function updateCourse(course: NewCourse): Promise<Course> {
  const query = supabase
    .from("courses")
    .update(course)
    .eq("course_id", course.course_id)
    .select()
    .single();
  const response: PostgrestSingleResponse<Course> = await query;

  if (response.error) {
    throw new Error(`Failed to update course: ${response.error.message}`);
  }

  if (!response.data) {
    throw new Error("Course not found or update failed");
  }

  return response.data;
}

export async function deleteCourse(course_id: string): Promise<void> {
  const query = supabase.from("courses").delete().eq("course_id", course_id);
  await query;
}
