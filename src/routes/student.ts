import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import * as db from "../database/student.js";
import studentValidator from "../validators/studentValidator.js";

const studentApp = new Hono();

studentApp.get("/", async (c) => {
  try {
    const students: Student[] = await db.getStudents();
    return c.json(students);
  } catch (error) {
    return c.json([]);
  }
});

studentApp.get("/:id", async (c) => {
  const { id } = c.req.param();
  const students: Student[] = await db.getStudents();
  const student = students.find((student) => student.student_id === id);
  if (!student) {
    throw new HTTPException(404, {
      res: c.json({ error: "Student not found" }, 404),
    });
  }
  return c.json(student);
});

studentApp.post("/", studentValidator, async (c) => {
  const student: NewStudent = c.req.valid("json");
  const response: PostgrestSingleResponse<Student> = await db.createStudent(
    student
  );
  if (response.error) {
    throw new HTTPException(400, {
      res: c.json({ error: response.error.message }, 400),
    });
  }
  return c.json(response.data, 201);
});

studentApp.put("/:id", studentValidator, async (c) => {
  const { id } = c.req.param();
  const body: NewStudent = c.req.valid("json");
  const response: PostgrestSingleResponse<Student> = await db.updateStudent(
    id,
    body
  );
  if (response.error) {
    throw new HTTPException(404, {
      res: c.json({ error: response.error.message }, 404),
    });
  }
  return c.json(response.data, 200);
});

studentApp.delete("/:id", async (c) => {
  const { id } = c.req.param();
  const response: PostgrestSingleResponse<null> = await db.deleteStudent(id);
  if (response.error) {
    throw new HTTPException(404, {
      res: c.json({ error: response.error.message }, 404),
    });
  }
  return c.json(null, 200);
});

export default studentApp;
