export interface NewStudent {
  student_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  major?: string;
  phone_number?: string;
  course_id: string;
}

export interface Student extends NewStudent {
  student_id: string;
}

export type StudentListQuery = {
  limit?: number;
  offset?: number;
  major?: string;
  course_id?: string;
  q?: string;
  sort_by?: "first_name" | "last_name" | "email" | "date_of_birth" | string;
};
