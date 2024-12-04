exports.getCurrentAcademicYear = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth() dimulai dari 0

  if (currentMonth < 7) {
    // Sebelum Juli
    return `${currentYear - 1}/${currentYear}`;
  } else {
    // Juli atau setelahnya
    return `${currentYear}/${currentYear + 1}`;
  }
};

exports.getCurrentSemester = () => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // getMonth() dimulai dari 0

  // Januari - Juni: Semester Genap
  if (currentMonth >= 1 && currentMonth <= 6) {
    return "even";
  }

  // Juli - Desember: Semester Ganjil
  return "odd";
}
