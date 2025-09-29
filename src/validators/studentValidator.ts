import * as z from "zod";
import { zValidator } from "@hono/zod-validator";
import type { StudentListQuery } from "../types/student.d.js";

const createSchema = z.object({
  first_name: z.string("First name is required"),
  last_name: z.string("Last name is required"),
  email: z.email("Valid email is required"),
  date_of_birth: z.string("Valid date of birth is required"),
  student_id: z.string().optional(),
  major: z.string().optional(),
  phone_number: z.string().optional(),
  course_id: z.string("Course ID is required"),
});

const updateSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.email().optional(),
  date_of_birth: z.string().optional(),
  student_id: z.string().optional(),
  major: z.string().optional(),
  phone_number: z.string().optional(),
  course_id: z.string().optional(),
});

export const studentValidator = zValidator(
  "json",
  createSchema,
  (result, c) => {
    if (!result.success) {
      return c.json({ errors: result.error.issues }, 400);
    }
    if (!result.data.student_id) {
      result.data.student_id = `std_${Math.floor(1000 + Math.random() * 9000)}`;
    }
  }
);

export const studentUpdateValidator = zValidator(
  "json",
  updateSchema,
  (result, c) => {
    if (!result.success) {
      return c.json({ errors: result.error.issues }, 400);
    }
  }
);

const studentQuerySchema: z.ZodType<StudentListQuery> = z.object({
  limit: z.coerce.number().optional().default(10),
  offset: z.coerce.number().optional().default(0),
  major: z.string().optional(),
  course_id: z.string().optional(),
  q: z.string().optional(),
  sort_by: z
    .union([
      z.literal("first_name"),
      z.literal("last_name"),
      z.literal("email"),
      z.literal("date_of_birth"),
      z.string(),
    ])
    .optional()
    .default("first_name"),
});

export const studentQueryValidator = zValidator("query", studentQuerySchema);
