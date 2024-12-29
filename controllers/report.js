const fs = require("fs");
const path = require("path");
const {
  getCurrentAcademicYear,
  getCurrentSemester,
} = require("../utils/generate-current-academic-year");
const db = require("../config/db");
const { validationResult } = require("express-validator");
const pdf = require('html-pdf');

const getAllUserCourses = async ({
  page = 1,
  limit = 5,
  search = "",
  course_id = "",
  user_id = "",
  include_upcoming_schedule = 0,
  include_attendance_recap = 0,
}) => {
  const offset = (page - 1) * limit;

  try {
    const currentAcademicYear = getCurrentAcademicYear();
    const currentSemester = getCurrentSemester();

    const baseQuery = `
      SELECT 
        user_courses.id,
        user_id,
        users.name AS user_name, 
        users.identification_number,
        users.role,
        course_id, 
        courses.name AS course_name,
        academic_year,
        semester
        ${
          Number(include_upcoming_schedule)
            ? `,
        (
          SELECT JSON_OBJECT(
            'id', cm.id,
            'meeting_number', cm.meeting_number,
            'date', cm.date,
            'start_time', cm.start_time,
            'end_time', cm.end_time
          )
          FROM course_meetings cm
          WHERE cm.course_id = courses.id
            AND CONCAT(cm.date, ' ', cm.end_time) > NOW()
          ORDER BY CONCAT(cm.date, ' ', cm.start_time) ASC
          LIMIT 1
        ) AS upcoming_schedule`
            : ""
        }
        ${
          Number(include_attendance_recap)
            ? `,
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'meeting_number', cm.meeting_number,
              'is_past', 
                CASE 
                  WHEN CONCAT(cm.date, ' ', cm.end_time) < NOW() THEN true
                  ELSE false
                END,
              'attendance_record', (
                SELECT JSON_OBJECT(
                    'id', ar.id,
                    'student_id', ar.student_id,
                    'attendance_time', ar.attendance_time,
                    'latitude', ar.latitude,
                    'longitude', ar.longitude,
                    'status', ar.status,
                    'remarks', ar.remarks,
                    'file_path', ar.file_path
                )
                FROM attendance_records ar
                WHERE ar.course_meeting_id = cm.id
                AND ar.student_id = user_id
              )
            )
          )
          FROM course_meetings cm
          WHERE cm.course_id = courses.id
          ORDER BY cm.meeting_number ASC
        ) AS attendance_recap`
            : ""
        }
      FROM user_courses
      JOIN users ON user_courses.user_id = users.id
      JOIN courses ON user_courses.course_id = courses.id
      WHERE user_courses.academic_year = ? 
        AND user_courses.semester = ?
        AND (users.name LIKE ? OR courses.name LIKE ?)
        ${course_id ? "AND course_id = ?" : ""}
        ${user_id ? "AND user_id = ?" : ""}
      ORDER BY user_courses.id DESC
      LIMIT ? OFFSET ?;
    `;

    const params = [
      currentAcademicYear,
      currentSemester,
      `%${search}%`,
      `%${search}%`,
    ];

    if (course_id) {
      params.push(course_id);
    }

    if (user_id) {
      params.push(user_id);
    }

    params.push(Number(limit), Number(offset));

    const [rows] = await db.promise().query(baseQuery, params);

    // Parse JSON strings if include_upcoming_schedule is true
    if (Number(include_upcoming_schedule)) {
      rows.forEach((row) => {
        if (
          row.upcoming_schedule &&
          typeof row.upcoming_schedule === "string"
        ) {
          row.upcoming_schedule = JSON.parse(row.upcoming_schedule);
        }
      });
    }

    // Parse JSON strings if include_attendance_recap is true
    if (Number(include_attendance_recap)) {
      rows.forEach((row) => {
        if (row.attendance_recap && typeof row.attendance_recap === "string") {
          row.attendance_recap = JSON.parse(row.attendance_recap);
        }
      });
    }

    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM user_courses
      JOIN users ON user_courses.user_id = users.id
      JOIN courses ON user_courses.course_id = courses.id
      WHERE user_courses.academic_year = ? 
        AND user_courses.semester = ?
        AND (users.name LIKE ? OR courses.name LIKE ?)
        ${course_id ? "AND course_id = ?" : ""}
        ${user_id ? "AND user_id = ?" : ""}
    `;

    const countParams = [
      currentAcademicYear,
      currentSemester,
      `%${search}%`,
      `%${search}%`,
    ];

    if (course_id) {
      countParams.push(course_id);
    }

    if (user_id) {
      countParams.push(user_id);
    }

    const [totalRows] = await db.promise().query(countQuery, countParams);
    const total = totalRows[0].total;

    return {
      data: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getCourseDetails = async (id) => {
  try {
    const query = `
      SELECT 
        courses.*,
        users.name AS lecturer_name,
        locations.name AS location_name
      FROM courses 
      JOIN users ON courses.lecturer_id = users.id
      JOIN locations ON courses.location_id = locations.id
      WHERE courses.id = ?
    `;

    const [courseRows] = await db.promise().query(query, [id]);
    if (courseRows.length === 0) {
      throw new Error("Course not found");
    }

    const [meetingsRows] = await db
      .promise()
      .query("SELECT * FROM course_meetings WHERE course_id = ?", [id]);

    return {
      data: {
        ...courseRows[0],
        meetings: meetingsRows,
      },
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAttendanceStatus = (attendance) => {
  if (attendance?.is_past && !!attendance?.attendance_record) {
    switch (attendance?.attendance_record?.status) {
      case "present":
        return "H";
      case "permission":
        return "I";
      case "sick":
        return "S";
      default:
        return "A";
    }
  }

  if (!attendance?.is_past && !!attendance?.attendance_record) {
    switch (attendance?.attendance_record?.status) {
      case "present":
        return "H";
      case "permission":
        return "I";
      case "sick":
        return "S";
      default:
        return "A";
    }
  }

  if (attendance?.is_past && !attendance?.attendance_record) {
    return "A";
  }

  return "-";
};

exports.generateAttendanceRecapReport = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { course_id } = req.body;
    const userCourses = await getAllUserCourses({
      page: 1,
      limit: 100,
      course_id,
      include_attendance_recap: 1,
    });
    const courseDetails = await getCourseDetails(course_id);

    // Membaca template HTML
    const templatePath = path.resolve(
      __dirname,
      "../report-templates/attendance-recap.html"
    );
    let htmlContent = fs.readFileSync(templatePath, "utf-8");

    // Replace placeholder dengan data dari request body
    let tableRows = "";
    userCourses?.data?.forEach((row, index) => {
      tableRows += `
        <tr>
          <td class="text-sm">${index + 1}</td>
          <td class="text-sm">${row.user_name}</td>
          <td class="text-sm">${row.identification_number}</td>
          ${row?.attendance_recap
            ?.map(
              (attendance) =>
                `<td class="text-sm">${getAttendanceStatus(attendance)}</td>`
            )
            .join("")}
        </tr>
      `;
    });

    const currentAcademicYear = getCurrentAcademicYear();
    const currentSemester = getCurrentSemester();

    htmlContent = htmlContent.replace("{{academicYear}}", currentAcademicYear);
    htmlContent = htmlContent.replace(
      "{{semester}}",
      currentSemester === "odd" ? "Ganjil" : "Genap"
    );
    htmlContent = htmlContent.replace(
      "{{courseName}}",
      courseDetails?.data?.name
    );
    htmlContent = htmlContent.replace("{{content}}", tableRows);

    // Generate PDF menggunakan html-pdf
    const options = {
      format: 'A4',
      orientation: 'landscape',
      border: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm',
      },
    };

    pdf.create(htmlContent, options).toBuffer((err, buffer) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to generate PDF" });
      }
      
      // Kirim PDF sebagai response
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="attendance_report.pdf"'
      );
      res.end(buffer);
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
};

exports.generateAttendanceRecapPerUserReport = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { course_id, user_id } = req.body;
    const userCourses = await getAllUserCourses({
      page: 1,
      limit: 100,
      course_id,
      user_id,
      include_attendance_recap: 1,
    });

    // Membaca template HTML
    const templatePath = path.resolve(
      __dirname,
      "../report-templates/attendance-recap-per-user.html"
    );
    let htmlContent = fs.readFileSync(templatePath, "utf-8");

    // Replace placeholder dengan data dari request body
    let tableRows = "";
    userCourses?.data?.[0]?.attendance_recap?.forEach((row, index) => {
      const full_file_path = row?.attendance_record?.file_path
        ? `${req.protocol}://${req.get("host")}/${
            row?.attendance_record?.file_path
          }`
        : "";
      const link =
        full_file_path?.length > 0
          ? `<a href="${full_file_path}" target="_blank">${full_file_path?.slice(
              0,
              30
            )}...</a>`
          : "";

      tableRows += `
        <tr>
          <td class="text-sm">${row?.meeting_number}</td>
          <td class="text-sm">${
            getAttendanceStatus(row) === "H" ? "✔" : "-"
          }</td>          
          <td class="text-sm">${
            getAttendanceStatus(row) === "I" ? "✔" : "-"
          }</td>          
          <td class="text-sm">${
            getAttendanceStatus(row) === "A" ? "✔" : "-"
          }</td>   
          <td class="text-sm text-left">${
            row?.attendance_record?.remarks || ""
          }</td>       
          <td class="text-sm w-[20%] text-left">${link}</td>       
        </tr>
      `;
    });

    const currentAcademicYear = getCurrentAcademicYear();
    const currentSemester = getCurrentSemester();

    htmlContent = htmlContent.replace(
      "{{name}}",
      userCourses?.data?.[0]?.user_name
    );
    htmlContent = htmlContent.replace("{{class}}", "-");
    htmlContent = htmlContent.replace(
      "{{identificationNumber}}",
      userCourses?.data?.[0]?.identification_number
    );
    htmlContent = htmlContent.replace("{{academicYear}}", currentAcademicYear);
    htmlContent = htmlContent.replace(
      "{{semester}}",
      currentSemester === "odd" ? "Ganjil" : "Genap"
    );
    htmlContent = htmlContent.replace(
      "{{courseName}}",
      userCourses?.data?.[0]?.course_name
    );
    htmlContent = htmlContent.replace("{{content}}", tableRows);

    // Konfigurasi opsi PDF
    const pdfOptions = {
      format: "A4",
      orientation: "landscape",
      border: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
    };

    // Buat PDF dari HTML
    pdf.create(htmlContent, pdfOptions).toBuffer((err, buffer) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to generate PDF" });
      }
      
      // Kirim PDF sebagai response
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="attendance_report_per_user.pdf"'
      );

      res.end(buffer);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
};
