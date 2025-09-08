import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase.js";

export const getStudents = async () => {
    const query = supabase.from("students").select("*");
    const students: PostgrestSingleResponse<Student[]> = await query;
    return students.data|| [];
}

export const getStudentById = async (id: string) => {
    const query = supabase.from("students").select("*").eq("student_id", id).single();
    const student: PostgrestSingleResponse<Student> = await query;
    return student.data|| null;
}

export const createStudent = async (student: NewStudent) => {
    const query = supabase.from("students").insert(student).select().single();
    const response: PostgrestSingleResponse<Student> = await query;
    return response;
}

export const updateStudent = async (id: string, student: NewStudent) => {
    const query = supabase.from("students").update(student).eq("student_id", id).select().single();
    const response: PostgrestSingleResponse<Student> = await query;
    return response;
}

export const deleteStudent = async (id: string) => {
    const query = supabase.from("students").delete().eq("student_id", id);
    const response: PostgrestSingleResponse<null> = await query;
    return response;
}