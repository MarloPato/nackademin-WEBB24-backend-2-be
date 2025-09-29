import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase.js";

export async function getCourses(): Promise<Course[]> {
  const query = supabase.from("courses").select("*");
  const courses: PostgrestSingleResponse<Course[]> = await query;
  return courses.data || [];
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
