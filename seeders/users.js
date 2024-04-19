const db = require("../config/db");
const bcrypt = require("bcryptjs");

const seedData = [
  {
    id: "1",
    name: "Antoni",
    email: "antoni@gmail.com",
    gender: "male",
    role: "student",
    identification_number: "2224568888",
    address: "test address antoni",
    phone_number: "082148507278",
    profile_url: "",
    status: "active",
    password: "12345678",
  },
  {
    id: "2",
    name: "Dosen 1",
    email: "dosen1@gmail.com",
    gender: "male",
    role: "lecturer",
    identification_number: "1234567890123456",
    address: "test address dosen 1",
    phone_number: "082148507278",
    profile_url: "",
    status: "active",
    password: "12345678",
  },
  {
    id: "3",
    name: "Anggi",
    email: "anggi@gmail.com",
    gender: "female",
    role: "student",
    identification_number: "2224568889",
    address: "test address anggi",
    phone_number: "082148507278",
    profile_url: "",
    status: "active",
    password: "12345678",
  },
  {
    id: "4",
    name: "Dosen 2",
    email: "dosen2@gmail.com",
    gender: "female",
    role: "lecturer",
    identification_number: "9876543210987654",
    address: "test address dosen 2",
    phone_number: "082148507278",
    profile_url: "",
    status: "active",
    password: "12345678",
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
