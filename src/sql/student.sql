CREATE TABLE students (
    student_id VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    course_id VARCHAR(255) NOT NULL,
    major VARCHAR(255)
    phone_number VARCHAR(255)
);

INSERT INTO students (student_id, first_name, last_name, email, date_of_birth, major, course_id) VALUES
('std_001', 'Anna', 'Karlsson', 'anna.k@example.com', '2003-05-15', 'Software Engineering', 'PGSQL-101'),
('std_002', 'Lars', 'Andersson', 'lars.a@example.com', '2001-11-30', 'Software Engineering', 'PGSQL-101'),
('std_003', 'Mikael', 'Persson', 'm.persson@example.com', '2002-01-20', 'Data Science', 'PGSQL-101'),
('std_004', 'Emma', 'Nilsson', 'emma.nilsson@example.com', '2003-08-22', 'Software Engineering', 'PGSQL-101'),
('std_005', 'Karin', 'Eriksson', 'karin.e@example.com', '2000-06-10', 'History', 'HIST-101'),
('std_006', 'William', 'Berg', 'william.b@example.com', '2002-12-01', 'Interaction Design', 'WEBDEV-205'),
('std_007', 'Sofia', 'Lindgren', 'sofia.lindgren@example.com', '2004-03-12', 'Software Engineering', 'WEBDEV-205'),
('std_008', 'Eva', 'Lundström', 'eva.lundstrom@example.com', '2003-01-05', 'History', 'HIST-101'),
('std_009', 'David', 'Chen', 'david.c@example.com', '2002-07-18', 'Software Engineering', 'WEBDEV-205');