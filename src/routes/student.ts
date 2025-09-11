import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import * as db from "../database/student.js";
import studentValidator from "../validators/studentValidator.js";
import { withSupabase, requireAuth } from "../middleware/auth.middleware.js";
const studentApp = new Hono();

studentApp.get("/", withSupabase, async (c) => {
  const sb = c.get("supabase");
  try {
    const students: Student[] = await db.getStudents(sb);
    return c.json(students);
  } catch (error) {
    return c.json([]);
  }
});

studentApp.get("/:id", withSupabase, async (c) => {
  const sb = c.get("supabase");
  const { id } = c.req.param();
  const students: Student[] = await db.getStudents(sb);
  const student = students.find((student) => student.student_id === id);
  if (!student) {
    throw new HTTPException(404, {
      res: c.json({ error: "Student not found" }, 404),
    });
  }
  return c.json(student);
});

studentApp.post("/", withSupabase, requireAuth, studentValidator, async (c) => {
  const sb = c.get("supabase");
  const student: NewStudent = c.req.valid("json");
  const response: PostgrestSingleResponse<Student> = await db.createStudent(
    sb,
    student
  );
  if (response.error) {
    throw new HTTPException(400, {
      res: c.json({ error: response.error.message }, 400),
    });
  }
  return c.json(response.data, 201);
});

studentApp.put(
  "/:id",
  withSupabase,
  requireAuth,
  studentValidator,
  async (c) => {
    const sb = c.get("supabase");
    const { id } = c.req.param();
    const body: NewStudent = c.req.valid("json");
    const response: PostgrestSingleResponse<Student> = await db.updateStudent(
      sb,
      id,
      body
    );
    if (response.error) {
      throw new HTTPException(404, {
        res: c.json({ error: response.error.message }, 404),
      });
    }
    return c.json(response.data, 200);
  }
);

studentApp.delete("/:id", withSupabase, requireAuth, async (c) => {
  const sb = c.get("supabase");
  const { id } = c.req.param();
  const response: PostgrestSingleResponse<null> = await db.deleteStudent(
    sb,
    id
  );
  if (response.error) {
    throw new HTTPException(404, {
      res: c.json({ error: response.error.message }, 404),
    });
  }
  return c.json(null, 200);
});

export default studentApp;
