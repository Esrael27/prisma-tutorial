import express, { response } from 'express';
import { pool } from './config/db.config';

const app = express();

app.use(express.json());

app.post(("/create-table"),async (Request,Response)=>{
     try {
        // const table = `CREATE TABLE IF NOT EXISTS Students (
        // student_id INT AUTO_INCREMENT PRIMARY KEY,
        // student_name VARCHAR(50) NOT NULL,
        // student_age INT NOT NULL,
        // student_gender VARCHAR(50) NOT NULL
        // );`
        const table2 =`CREATE TABLE IF NOT EXISTS Courses (
        course_id INT AUTO_INCREMENT PRIMARY KEY,
        course_name VARCHAR(50) NOT NULL,
        student_id INT,
        FOREIGN KEY (student_id) REFERENCES students(student_id)
        )`
        const result = await pool.query(table2)
        Response.send("Table created successfully")
     } catch (error) {
        console.log(error)
     }
})


app.post( "/addstudent", async(Request,Response) => {
    const { student_name, student_age, student_gender } = Request.body;
    try {
        const student = "INSERT INTO studentS (student_name, student_age, student_gender ) VALUES (?,?,?)";
        const values = [student_name, student_age, student_gender];
        const [result] = await pool.query(student, values);
        Response.status(201).json({ message: "Student added successfully",});
    } catch (error) {
        console.log(error)
    }
})

app.get("/getstudents", async(Request,Response) => {
    try {
        const students = `SELECT students.*,
        JSON_ARRAYAGG(
        JSON_OBJECT(
            'course_id', courses.course_id,
            'course_name', courses.course_name
        )
    ) AS courses
FROM students
LEFT JOIN courses ON students.student_id = courses.student_id
GROUP BY students.student_id;
`
        const [result] = await pool.query(students);
        Response.status(200).json({
            message: "Students fetched successfully",
            result
        })
    } catch (error) {
        console.log(error)
    }
})


app.put("/student/:id", async (Request, Response) => {
    const { id } = Request.params;
    const { student_name, student_age, student_gender } = Request.body;
    try {
        const updateStudent = 'UPDATE Students SET student_name = ?, student_age = ?, student_gender = ? WHERE student_id = ?'
        const values = [student_name, student_age, student_gender, id];
        const [result] = await pool.query(updateStudent, values);
        Response.status(200).json({ message: "Student updated successfully" });
    } catch (error) {
        console.log(error)
    }
})

app.delete("/student/:id", async (Request, Response) => {
    const { id } = Request.params;
    try {
        const updateStudent = 'DELETE FROM Students   WHERE student_id = ?'
        const values = [id];
        const [result] = await pool.query(updateStudent, values);
        Response.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        console.log(error)
    }
})

app.post( "/addcourse", async(Request,Response) => {
    const { course_name, student_id } = Request.body;
    try {
        const student = "INSERT INTO Courses (course_name, student_id) VALUES (?,?)";
        const values = [course_name, student_id];
        const [result] = await pool.query(student, values);
        Response.status(201).json({ message: "Student added successfully",});
    } catch (error) {
        console.log(error)
    }
})
app.listen(1212)