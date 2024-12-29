const db = require("../config/db");
const bcrypt = require("bcryptjs");

const seedData = [
  {
    id: 1,
    name: "Introduction to Computer Science",
    code: "CS101",
    lecturer_id: 2,
  },
  {
    id: 2,
    name: "Data Structures and Algorithms",
    code: "CS201",
    lecturer_id: 4,
  },
  {
    id: 3,
    name: "Database Management Systems",
    code: "CS301",
    lecturer_id: 2,
  },
  {
    id: 4,
    name: "Operating Systems",
    code: "CS401",
    lecturer_id: 4,
  },
  {
    id: 5,
    name: "Computer Networks",
    code: "CS501",
    lecturer_id: 2,
  },
  {
    id: 6,
    name: "Software Engineering",
    code: "CS601",
    lecturer_id: 4,
  },
  {
    id: 7,
    name: "Artificial Intelligence",
    code: "CS701",
    lecturer_id: 2,
  },
  {
    id: 8,
    name: "Machine Learning",
    code: "CS801",
    lecturer_id: 4,
  },
  {
    id: 9,
    name: "Human-Computer Interaction",
    code: "CS901",
    lecturer_id: 2,
  },
  {
    id: 10,
    name: "Cyber Security",
    code: "CS1001",
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
          "INSERT INTO courses (name, code, lecturer_id) VALUES (?, ?, ?)",
          [data.name, data.code, data.lecturer_id]
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
