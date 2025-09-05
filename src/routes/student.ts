import { Hono } from "hono";
import fs from "fs/promises";
import studentValidator from "../validators/studentValidator.js";

const studentApp = new Hono();

studentApp.get("/", async (c) => {

    try {
        //? Database query simulation /data/students.json
        const data: string = await fs.readFile("src/data/students.json", "utf8");
        const students: Student[] = JSON.parse(data);
        return c.json(students);
    } catch (error) {
        return c.json([]);
    }
});

studentApp.get("/:id",async (c) => {
    const { id } = c.req.param();
    try {
        const data: string = await fs.readFile("src/data/students.json", "utf8");
        const students: Student[] = JSON.parse(data);
        const student = students.find((student) => student.student_id === id);
        if (!student) {
            throw new Error("Student not found");
        }
        return c.json(student);
    } catch (error) {
        console.error(error);
        return c.json(null, 404);
    }
});

studentApp.post("/", studentValidator, async (c) => {
    try {
        const student: NewStudent = c.req.valid("json");
        return c.json(student, 201);
    } catch (error) {
        console.error(error);
        return c.json({ error: "Failed to create student" }, 400);
    }
});

studentApp.put("/:id", studentValidator, async (c) => {
    const { id } = c.req.param();
    try {
        const body: NewStudent = c.req.valid("json");
        const data: string = await fs.readFile("src/data/students.json", "utf8");
        const students: Student[] = JSON.parse(data);
        const student = students.find((student) => student.student_id === id);
        if (!student) {
            return c.json({ error: "Student not found" }, 404);
        }
        const updatedStudent: Student = {
            ...body,
            student_id: id,
        };
        return c.json(updatedStudent, 200);
    } catch (error) {
        console.error(error);
        return c.json({ error: "Failed to update student" }, 400);
    }
});

studentApp.delete("/:id", async (c) => {

    const { id } = c.req.param();
    try {
        const data: string = await fs.readFile("src/data/students.json", "utf8");
        const students: Student[] = JSON.parse(data);
        const student = students.find((student) => student.student_id === id);
        if (!student) {
            return c.json({ error: "Student not found" }, 404);
        }
        return c.json(student, 200);
    } catch (error) {
        console.error(error);
        return c.json({ error: "Failed to delete student" }, 400);
    }
});

export default studentApp;