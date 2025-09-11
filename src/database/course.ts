import type {
  PostgrestSingleResponse,
  SupabaseClient,
} from "@supabase/supabase-js";

export const getCourses = async (sb: SupabaseClient) => {
  const query = sb.from("courses").select("*"); // To Be improved upon
  const courses: PostgrestSingleResponse<Course[]> = await query;
  return courses.data || [];
};

export const getCourseById = async (sb: SupabaseClient, id: string) => {
  const query = sb.from("courses").select("*").eq("course_id", id).single();
  const course: PostgrestSingleResponse<Course> = await query;
  return course.data || null;
};

export const createCourse = async (sb: SupabaseClient, course: NewCourse) => {
  const query = sb.from("courses").insert(course).select().single();
  const response: PostgrestSingleResponse<Course> = await query;
  return response;
};

export const updateCourse = async (
  sb: SupabaseClient,
  id: string,
  course: NewCourse
) => {
  const query = sb
    .from("courses")
    .update(course)
    .eq("course_id", id)
    .select()
    .single();
  const response: PostgrestSingleResponse<Course> = await query;
  return response;
};

export const deleteCourse = async (sb: SupabaseClient, id: string) => {
  const query = sb
    .from("courses")
    .delete()
    .eq("course_id", id)
    .select()
    .single();
  const response: PostgrestSingleResponse<Course> = await query;
  return response;
};
