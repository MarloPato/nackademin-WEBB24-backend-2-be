import { Hono } from "hono";
import fs from "fs/promises";

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

export default courseApp;
