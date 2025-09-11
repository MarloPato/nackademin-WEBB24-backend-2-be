import { Hono } from "hono";
import courseValidator from "../validators/courseValidator.js";
import { HTTPException } from "hono/http-exception";
import * as db from "../database/course.js";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { withSupabase, requireAuth } from "../middleware/auth.middleware.js";
const courseApp = new Hono();

courseApp.get("/", withSupabase, async (c) => {
  try {
    const sb = c.get("supabase");
    const courses: Course[] = await db.getCourses(sb);
    return c.json(courses);
  } catch (error) {
    return c.json([]);
  }
});

courseApp.get("/:id", withSupabase, async (c) => {
  const { id } = c.req.param();
  try {
    const sb = c.get("supabase");
    const course: Course | null = await db.getCourseById(sb, id);
    if (!course) {
      throw new Error("Course not found");
    }
    return c.json(course);
  } catch (error) {
    console.error(error);
    return c.json(null, 404);
  }
});

courseApp.post("/", withSupabase, requireAuth, courseValidator, async (c) => {
    const sb = c.get("supabase");
    const newCourse: NewCourse = c.req.valid("json");
    const response: PostgrestSingleResponse<Course> = await db.createCourse(sb, newCourse);
    if(response.error) {
      throw new HTTPException(400, {
        res: c.json({ error: response.error.message }, 400),
      });
    }
    const course: Course = response.data;
    return c.json(course, 201);
});

courseApp.put("/:id", withSupabase, courseValidator, async (c) => {
  const sb = c.get("supabase");
  const { id } = c.req.param();
  const body: NewCourse = c.req.valid("json");
  const response: PostgrestSingleResponse<Course> = await db.updateCourse(sb, id, body);
  console.log("Here is the response", response);
  if(response.error) {
    throw new HTTPException(404, {
        res: c.json({ error: "Course not found" }, 404),
    });
  }
  return c.json(response.data, 200);
});

courseApp.delete("/:id", withSupabase, requireAuth, async (c) => {
  const sb = c.get("supabase");
  const { id } = c.req.param();
  const response: PostgrestSingleResponse<Course> = await db.deleteCourse(sb, id);
  if (response.error) {
    throw new HTTPException(404, {
      res: c.json({ error: "Course not found" }, 404),
    });
  }
  return c.json(null, 200);
});

export default courseApp;
