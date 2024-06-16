const db = require("../config/db");
const bcrypt = require("bcryptjs");

const seedData = [
  {
    id: 1,
    course_name: "Introduction to Computer Science",
    course_code: "CS101",
    lecturer_id: 2
  },
  {
    id: 2,
    course_name: "Data Structures and Algorithms",
    course_code: "CS201",
    lecturer_id: 4
  },
  {
    id: 3,
    course_name: "Database Management Systems",
    course_code: "CS301",
    lecturer_id: 2
  },
  {
    id: 4,
    course_name: "Operating Systems",
    course_code: "CS401",
    lecturer_id: 4
  },
  {
    id: 5,
    course_name: "Computer Networks",
    course_code: "CS501",
    lecturer_id: 2
  },
  {
    id: 6,
    course_name: "Software Engineering",
    course_code: "CS601",
    lecturer_id: 4
  },
  {
    id: 7,
    course_name: "Artificial Intelligence",
    course_code: "CS701",
    lecturer_id: 2
  },
  {
    id: 8,
    course_name: "Machine Learning",
    course_code: "CS801",
    lecturer_id: 4
  },
  {
    id: 9,
    course_name: "Human-Computer Interaction",
    course_code: "CS901",
    lecturer_id: 2
  },
  {
    id: 10,
    course_name: "Cyber Security",
    course_code: "CS1001",
    lecturer_id: 4
  },
];

async function seed() {
  await db.promise().beginTransaction();

  try {
    const salt = await bcrypt.genSalt(10);

    for (const data of seedData) {
      const encryptedPassword = await bcrypt.hash(data.password, salt);

      await db
        .promise()
        .query(
          "INSERT INTO `users`(`name`, `email`, `gender`, `role`, `identification_number`, `address`, `phone_number`, `profile_url`, `status`, `password`) VALUES (?,?,?,?,?,?,?,?,?,?)",
          [
            data.name,
            data.email,
            data.gender,
            data.role,
            data.identification_number,
            data.address,
            data.phone_number,
            data.profile_url,
            data.status,
            encryptedPassword,
          ]
        );
    }

    await db.promise().commit();
    console.log('Seeder "Users" executed successfully!');
  } catch (error) {
    await db.promise().rollback();
    console.error("Error in seeder:", error);
  }
}

module.exports = {
  seed,
};
