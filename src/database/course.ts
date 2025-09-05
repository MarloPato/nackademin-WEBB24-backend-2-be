import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase.js";

export const getCourses = async () => {
    const query = supabase.from("courses").select("*"); // To Be improved upon
    const courses: PostgrestSingleResponse<Course[]> = await query;
    return courses.data|| [];
}

export const getCourseById = async (id: string) => {
    const query = supabase.from("courses").select("*").eq("course_id", id).single();
    const course: PostgrestSingleResponse<Course> = await query;
    return course.data|| null;
}

export const createCourse = async (course: NewCourse) => {
    const query = supabase.from("courses").insert(course).select().single();
    const response: PostgrestSingleResponse<Course> = await query;
    return response
}

export const updateCourse = async (id: string, course: NewCourse) => {
    const query = supabase.from("courses").update(course).eq("course_id", id).select().single();
    const response: PostgrestSingleResponse<Course> = await query;
    return response;
}

export const deleteCourse = async (id: string) => {
    const query = supabase.from("courses").delete().eq("course_id", id).select().single();
    const response: PostgrestSingleResponse<Course> = await query;
    return response;
}