interface NewStudent {
    student_id?: string;
    first_name: string;
    last_name: string;
    email: string;
    date_of_birth: string;
    major?: string;
    phone_number?: string;
    course_id: string;
}

interface Student extends NewStudent {
    student_id: string;
}