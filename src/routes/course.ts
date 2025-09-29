import { Hono } from "hono";
import { supabase } from "../lib/supabase.js";
import fs from "fs/promises";
import {
  courseValidator,
  courseQueryValidator,
} from "../validators/courseValidator.js";
import * as db from "../database/course.js";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";

const courseApp = new Hono();

courseApp.get("/", courseQueryValidator, async (c) => {
  const { limit, offset, department, q, sortby } = c.req.valid("query");

  try {
    //? Database query simulation /data/courses.json
    // const startIndex = offset-1 > 0 ? offset-1 : 0
    // const endIndex = startIndex + limit -1
    const courses: Course[] = await db.getCourses();
    const response = {
      data: courses,
      offset,
      limit,
    };
    return c.json(response);
  } catch (error) {
    return c.json([]);
  }
});

courseApp.get("/:id", async (c) => {
  const { id } = c.req.param();
  try {
    const courses: Course[] = await db.getCourses();
    const course = courses.find((course) => course.course_id === id);
    if (!course) {
      return c.json({ error: "Course not found" }, 404);
    }
    return c.json(course);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to fetch course" }, 500);
  }
});

courseApp.post("/", courseValidator, async (c) => {
  try {
    const newCourse: NewCourse = c.req.valid("json");
    const course: Course = await db.createCourse(newCourse);
    return c.json(course, 201);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to create course" }, 400);
  }
});

courseApp.put("/:id", courseValidator, async (c) => {
  const { id } = c.req.param();
  try {
    const body: NewCourse = c.req.valid("json");
    const updatedCourse: Course = await db.updateCourse({
      ...body,
      course_id: id,
    });
    return c.json(updatedCourse, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to update course" }, 400);
  }
});

courseApp.delete("/:id", async (c) => {
  const { id } = c.req.param();
  try {
    const data: string = await fs.readFile("src/data/courses.json", "utf8");
    const courses: Course[] = JSON.parse(data);
    const course = courses.find((course) => course.course_id === id);
    if (!course) {
      return c.json({ error: "Course not found" }, 404);
    }
    return c.json(course, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to delete course" }, 400);
  }
});

export default courseApp;
