import { Hono } from "hono";
import fs from "fs/promises";
import courseValidator from "../validators/courseValidator.js";
const courseApp = new Hono();

courseApp.get("/", async (c) => {
  try {
    const data: string = await fs.readFile("src/data/courses.json", "utf8");
    const courses: Course[] = JSON.parse(data);
    return c.json(courses);
  } catch (error) {
    console.warn("error fetching courses:", error);
    return c.json([]);
  }
});

courseApp.get("/:id", async (c) => {
  const { id } = c.req.param();
  try {
    const data: string = await fs.readFile("src/data/courses.json", "utf8");
    const courses: Course[] = JSON.parse(data);
    const course = courses.find((course) => course.course_id === id);
    if (!course) {
      return c.json(null, 404);
    }
    return c.json(course);
  } catch (error) {
    console.error(error);
    return c.json(null, 500);
  }
});

courseApp.post("/", courseValidator, async (c) => {
  try {
    const newCourse: NewCourse = c.req.valid("json");
    //TODO: Update data in database
    return c.json(newCourse, 201);
  } catch (error) {
    console.warn("error creating course:", error);
    return c.json(
      {
        message: "Error in creating course",
      },
      400
    );
  }
});

courseApp.put("/:id", courseValidator, async (c) => {
  const { id } = c.req.param();
  try {
    const body: NewCourse = c.req.valid("json");
    const data: string = await fs.readFile("src/data/courses.json", "utf8");
    const courses: Course[] = JSON.parse(data);
    const course = courses.find((course) => course.course_id === id);
    if (!course) {
      return c.json(null, 404);
    }
    const updatedCourse: Course = {
      ...course,
      ...body,
      course_id: id,
    };
    return c.json(updatedCourse, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to update course" }, 500);
  }
});

courseApp.delete("/:id", async (c) => {
  const { id } = c.req.param();
  try {
    const data: string = await fs.readFile("src/data/courses.json", "utf8");
    const courses: Course[] = JSON.parse(data);
    const course = courses.find((course) => course.course_id === id);
    if (!course) {
      return c.json(null, 404);
    }
    return c.json(course, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to delete course" }, 500);
  }
});

export default courseApp;
