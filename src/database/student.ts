import type { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";

export const getStudents = async (sb: SupabaseClient) => {
    const query = sb.from("students").select("*");
    const students: PostgrestSingleResponse<Student[]> = await query;
    return students.data|| [];
}

export const getStudentById = async (sb: SupabaseClient, id: string) => {
    const query = sb.from("students").select("*").eq("student_id", id).single();
    const student: PostgrestSingleResponse<Student> = await query;
    return student.data|| null;
}

export const createStudent = async (sb: SupabaseClient, student: NewStudent) => {
    const query = sb.from("students").insert(student).select().single();
    const response: PostgrestSingleResponse<Student> = await query;
    return response;
}

export const updateStudent = async (sb: SupabaseClient, id: string, student: NewStudent) => {
    const query = sb.from("students").update(student).eq("student_id", id).select().single();
    const response: PostgrestSingleResponse<Student> = await query;
    return response;
}

export const deleteStudent = async (sb: SupabaseClient, id: string) => {
    const query = sb.from("students").delete().eq("student_id", id);
    const response: PostgrestSingleResponse<null> = await query;
    return response;
}