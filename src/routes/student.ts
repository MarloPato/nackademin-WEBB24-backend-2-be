import { Hono } from "hono";
import fs from "fs/promises";
import {
  studentValidator,
  studentUpdateValidator,
  studentQueryValidator,
} from "../validators/studentValidator.js";
import * as db from "../database/student.js";
import type { Student, NewStudent } from "../types/student.d.js";

const studentApp = new Hono();

studentApp.get("/", studentQueryValidator, async (c) => {
  const query = c.req.valid("query");

  try {
    const response = await db.getStudents(query);
    return c.json(response);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to fetch students" }, 500);
  }
});

studentApp.get("/:id", async (c) => {
  const { id } = c.req.param();
  try {
    const student = await db.getStudentById(id);
    if (!student) {
      return c.json({ error: "Student not found" }, 404);
    }
    return c.json(student);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to fetch student" }, 500);
  }
});

studentApp.post("/", studentValidator, async (c) => {
  try {
    const newStudent: NewStudent = c.req.valid("json");
    const student: Student = await db.createStudent(newStudent);
    return c.json(student, 201);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to create student" }, 400);
  }
});

studentApp.put("/:id", studentUpdateValidator, async (c) => {
  const { id } = c.req.param();
  try {
    const body = c.req.valid("json");
    const updatedStudent: Student = await db.updateStudent({
      ...body,
      student_id: id,
    } as NewStudent);
    return c.json(updatedStudent, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to update student" }, 400);
  }
});

studentApp.delete("/:id", async (c) => {
  const { id } = c.req.param();
  try {
    await db.deleteStudent(id);
    return c.json({ message: "Student deleted successfully" }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to delete student" }, 400);
  }
});

export default studentApp;
