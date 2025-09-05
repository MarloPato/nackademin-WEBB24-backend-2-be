import * as z from 'zod'
import { zValidator } from '@hono/zod-validator'

const schema = z.object({
    first_name: z.string("First name is required"),
    last_name: z.string("Last name is required"),
    email: z.email("Valid email is required"),
    date_of_birth: z.string("Valid date of birth is required"),
    student_id: z.string().optional(),
    major: z.string().optional(),
    course_id: z.string("Course ID is required"),
});


const studentValidator = zValidator("json", schema, (result, c) => {
    if(!result.success) {
        return c.json({ errors: result.error.issues }, 400);
    }
    if(!result.data.student_id) {
        result.data.student_id = `std_${Math.floor(1000 + Math.random() * 9000)}`;
    }
});
export default studentValidator;