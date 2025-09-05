import { Hono } from "hono";
import courseValidator from "../validators/courseValidator.js";
import { HTTPException } from "hono/http-exception";
import * as db from "../database/course.js";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";
const courseApp = new Hono();

courseApp.get("/", async (c) => {
  try {
    const courses: Course[] = await db.getCourses();
    return c.json(courses);
  } catch (error) {
    return c.json([]);
  }
});

courseApp.get("/:id", async (c) => {
  const { id } = c.req.param();
  try {
    const course: Course | null = await db.getCourseById(id);
    if (!course) {
      throw new Error("Course not found");
    }
    return c.json(course);
  } catch (error) {
    console.error(error);
    return c.json(null, 404);
  }
});

courseApp.post("/", courseValidator, async (c) => {
    const newCourse: NewCourse = c.req.valid("json");
    const response: PostgrestSingleResponse<Course> = await db.createCourse(newCourse);
    if(response.error) {
      throw new HTTPException(400, {
        res: c.json({ error: response.error.message }, 400),
      });
    }
    const course: Course = response.data;
    return c.json(course, 201);
});

courseApp.put("/:id", courseValidator, async (c) => {
  const { id } = c.req.param();
  const body: NewCourse = c.req.valid("json");
  const response: PostgrestSingleResponse<Course> = await db.updateCourse(id, body);
  if(response.error) {
    throw new HTTPException(404, {
        res: c.json({ error: "Course not found" }, 404),
    });
  }
  return c.json(response.data, 200);
});

courseApp.delete("/:id", async (c) => {
  const { id } = c.req.param();
  const response: PostgrestSingleResponse<Course> = await db.deleteCourse(id);
  if (response.error) {
    throw new HTTPException(404, {
      res: c.json({ error: "Course not found" }, 404),
    });
  }
  return c.json(null, 200);
});

export default courseApp;
