const db = require("../config/db");
const bcrypt = require("bcryptjs");

const seedData = [
  {
    id: 1,
    course_name: "Introduction to Computer Science",
    course_code: "CS101",
    lecturer_id: 2,
  },
  {
    id: 2,
    course_name: "Data Structures and Algorithms",
    course_code: "CS201",
    lecturer_id: 4,
  },
  {
    id: 3,
    course_name: "Database Management Systems",
    course_code: "CS301",
    lecturer_id: 2,
  },
  {
    id: 4,
    course_name: "Operating Systems",
    course_code: "CS401",
    lecturer_id: 4,
  },
  {
    id: 5,
    course_name: "Computer Networks",
    course_code: "CS501",
    lecturer_id: 2,
  },
  {
    id: 6,
    course_name: "Software Engineering",
    course_code: "CS601",
    lecturer_id: 4,
  },
  {
    id: 7,
    course_name: "Artificial Intelligence",
    course_code: "CS701",
    lecturer_id: 2,
  },
  {
    id: 8,
    course_name: "Machine Learning",
    course_code: "CS801",
    lecturer_id: 4,
  },
  {
    id: 9,
    course_name: "Human-Computer Interaction",
    course_code: "CS901",
    lecturer_id: 2,
  },
  {
    id: 10,
    course_name: "Cyber Security",
    course_code: "CS1001",
    lecturer_id: 4,
  },
];

async function seed() {
  await db.promise().beginTransaction();

  try {
    for (const data of seedData) {
      await db
        .promise()
        .query(
          "INSERT INTO courses (course_name, course_code, lecturer_id) VALUES (?, ?, ?)",
          [data.course_name, data.course_code, data.lecturer_id]
        );
    }

    await db.promise().commit();
    console.log('Seeder "Courses" executed successfully!');
  } catch (error) {
    await db.promise().rollback();
    console.error("Error in seeder:", error);
  }
}

module.exports = {
  seed,
};
