import { validator } from "hono/validator";
import slugify from "slugify";

const courseValidator = validator("json", async (value, c) => {
    const course = await value as Partial<NewCourse>;
    const errors: {
        [key: string]: string[];
    } = {};
    if (!course.title) {
        errors.title = ["Title is required"];
    }
    if (!course.instructor) {
        errors.instructor = ["Instructor is required"];
    }
    if (!course.credits) {
        errors.credits = ["Credits is required"];
    }
    if (Object.keys(errors).length > 0) {
        return c.json({ errors }, 400);
    }
    if(course.course_id) {
        value.course_id = slugify.default(course.course_id, { lower: true, strict: true });
    }
    return value;
});

export default courseValidator;