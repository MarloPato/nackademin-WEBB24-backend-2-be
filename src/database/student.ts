import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase.js";
import type {
  Student,
  StudentListQuery,
  NewStudent,
} from "../types/student.d.js";
import type { PaginatedListResponse } from "../types/global.js";

export async function getStudents(
  query: StudentListQuery
): Promise<PaginatedListResponse<Student>> {
  // Säkerhetskontroll för sortering
  const sortable = new Set([
    "first_name",
    "last_name",
    "email",
    "date_of_birth",
  ]);
  const order = query.sort_by
    ? sortable.has(query.sort_by)
      ? query.sort_by
      : "first_name"
    : "first_name";

  // Beräkna paginering
  const startIndex = query.offset || 0;
  const limit = query.limit || 10;
  const endIndex = startIndex + limit - 1;

  // Bygg grundläggande query
  const _query = supabase
    .from("students")
    .select("*", { count: "exact" })
    .order(order, { ascending: true });

  // Add pagination
  _query.range(startIndex, endIndex);

  // Lägg till filter för major
  if (query.major) {
    _query.eq("major", query.major);
  }

  // Lägg till filter för course_id
  if (query.course_id) {
    _query.eq("course_id", query.course_id);
  }

  // Lägg till textsökning
  if (query.q) {
    // Sök i first_name, last_name och email
    _query.or(
      `first_name.ilike.%${query.q}%,last_name.ilike.%${query.q}%,email.ilike.%${query.q}%`
    );
  }

  // Utför query
  const students: PostgrestSingleResponse<Student[]> = await _query;

  // Returnera paginerat svar
  return {
    data: students.data || [],
    count: students.count || 0,
    offset: query.offset || 0,
    limit: query.limit || 10,
  };
}

export async function createStudent(student: NewStudent): Promise<Student> {
  const query = supabase.from("students").insert(student).select().single();
  const response: PostgrestSingleResponse<Student> = await query;
  return response.data!;
}

export async function updateStudent(student: NewStudent): Promise<Student> {
  const query = supabase
    .from("students")
    .update(student)
    .eq("student_id", student.student_id)
    .select()
    .single();
  const response: PostgrestSingleResponse<Student> = await query;

  if (response.error) {
    throw new Error(`Failed to update student: ${response.error.message}`);
  }

  if (!response.data) {
    throw new Error("Student not found or update failed");
  }

  return response.data;
}

export async function getStudentById(student_id: string): Promise<Student | null> {
  const query = supabase
    .from("students")
    .select("*")
    .eq("student_id", student_id)
    .single();
  const response: PostgrestSingleResponse<Student> = await query;
  
  if (response.error) {
    return null;
  }
  
  return response.data;
}

export async function deleteStudent(student_id: string): Promise<void> {
  const query = supabase.from("students").delete().eq("student_id", student_id);
  await query;
}
