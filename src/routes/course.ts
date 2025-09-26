import { Hono } from "hono";
import fs from "fs/promises";
import { courseValidator, courseQueryValidator } from "../validators/courseValidator.js";
import { partialFilter, exactFilter } from "../utils/filters.js";
import { sorter } from "../utils/sorters.js";

const courseApp = new Hono();

courseApp.get("/", courseQueryValidator, async (c) => {
    const { limit, offset, department, q, sortby } = c.req.valid("query");

    try {
        //? Database query simulation /data/courses.json
        const data: string = await fs.readFile("src/data/courses.json", "utf8");
        let courses: Course[] = JSON.parse(data);
        if(department) {
            courses = courses.filter((course) => exactFilter(course, department, ["department"]));
        }
        if(q) {
            courses = courses.filter((course) => partialFilter(course, q, ["title", "instructor", "description"]));
        }
        if(sortby === "title" || sortby === "start_date") {
            courses = courses.sort((a, b) => sorter(a, b, sortby));
        }
        const response = {
          data: courses.slice(offset, offset + limit),
          count: courses.length,
          offset,
          limit,
        }
        return c.json(response);
    } catch (error) {
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
            throw new Error("Course not found");
        }
        return c.json(course);
    } catch (error) {
        console.error(error);
        return c.json(null, 404);
    }
});

courseApp.post("/", courseValidator, async (c) => {
    try {
        const newCourse: NewCourse = c.req.valid("json");
        return c.json(newCourse, 201);
    } catch (error) {
        console.error(error);
        return c.json({ error: "Failed to create course" }, 400);
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
            return c.json({ error: "Course not found" }, 404);
        }
        const updatedCourse: Course = {
            ...course,
            ...body,
            course_id: id,
        };
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
