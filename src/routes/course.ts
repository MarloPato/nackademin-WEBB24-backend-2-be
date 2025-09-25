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
    const { id } = c.req.param()
  //TODO: Fetch single course
  //TODO: Handle 404
});

courseApp.post("/", courseValidator, async (c) => {
  try {
    const newCourse: NewCourse = c.req.valid("json")
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

courseApp.put("/:id", async (c) => {
    const { id } = c.req.param()
  //TODO: update single course
  //TODO: Handle 404

});

courseApp.delete("/:id", async (c) => {
    const { id } = c.req.param()
  //TODO: delete single course
  //TODO: Handle 404

});

export default courseApp;
