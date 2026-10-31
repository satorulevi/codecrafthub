// app.js

// Import required packages
const express = require("express");
const fs = require("fs/promises");
const path = require("path");

// Create the Express application
const app = express();

// Run the server on port 5000
const PORT = 5000;

// Store courses.json in the project root
const COURSES_FILE = path.join(__dirname, "courses.json");

// Allowed values for the course status field
const VALID_STATUSES = [
  "Not Started",
  "In Progress",
  "Completed"
];

/*
  Middleware that allows Express to read JSON request bodies.

  For example, this allows us to read:
  {
    "name": "Node.js Basics"
  }

  from req.body.
*/
app.use(express.json());

/*
  Create courses.json if it does not already exist.

  The file starts with an empty array because courses are stored
  as an array of objects.
*/
async function ensureCoursesFileExists() {
  try {
    await fs.access(COURSES_FILE);
  } catch (error) {
    // ENOENT means that the file does not exist
    if (error.code === "ENOENT") {
      await fs.writeFile(COURSES_FILE, "[]", "utf8");
    } else {
      throw error;
    }
  }
}

/*
  Read and parse courses.json.

  This function returns the courses as a JavaScript array.
*/
async function readCoursesFile() {
  try {
    await ensureCoursesFileExists();

    const fileContents = await fs.readFile(COURSES_FILE, "utf8");
    const courses = JSON.parse(fileContents);

    // Make sure the JSON file contains an array
    if (!Array.isArray(courses)) {
      const error = new Error("courses.json must contain an array.");
      error.statusCode = 500;
      throw error;
    }

    return courses;
  } catch (error) {
    // JSON.parse errors indicate invalid JSON
    if (error instanceof SyntaxError) {
      const jsonError = new Error(
        "Unable to read courses.json because it contains invalid JSON."
      );

      jsonError.statusCode = 500;
      throw jsonError;
    }

    // Preserve errors that already have a status code
    if (error.statusCode) {
      throw error;
    }

    const fileError = new Error(
      "Unable to read courses.json."
    );

    fileError.statusCode = 500;
    fileError.originalError = error;

    throw fileError;
  }
}

/*
  Save the courses array back to courses.json.
*/
async function writeCoursesFile(courses) {
  try {
    const fileContents = JSON.stringify(courses, null, 2);

    await fs.writeFile(COURSES_FILE, fileContents, "utf8");
  } catch (error) {
    const fileError = new Error(
      "Unable to write to courses.json."
    );

    fileError.statusCode = 500;
    fileError.originalError = error;

    throw fileError;
  }
}

/*
  Validate a date in YYYY-MM-DD format.

  This checks both:
  1. The format
  2. Whether the date is a real calendar date

  For example:
  - 2026-12-25 is valid
  - 2026-02-30 is invalid
*/
function isValidDate(value) {
  if (typeof value !== "string") {
    return false;
  }

  const dateFormat = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateFormat.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/*
  Validate course data received from the client.

  This function returns an error message if the data is invalid.
  Otherwise, it returns null.
*/
function validateCourseData(courseData) {
  const {
    name,
    description,
    target_date,
    status
  } = courseData || {};

  // Check required text fields
  if (
    typeof name !== "string" ||
    name.trim() === ""
  ) {
    return "The name field is required.";
  }

  if (
    typeof description !== "string" ||
    description.trim() === ""
  ) {
    return "The description field is required.";
  }

  // Check target_date
  if (!target_date) {
    return "The target_date field is required.";
  }

  if (!isValidDate(target_date)) {
    return "The target_date must use the format YYYY-MM-DD and be a valid date.";
  }

  // Check status
  if (!status) {
    return "The status field is required.";
  }

  if (!VALID_STATUSES.includes(status)) {
    return `The status must be one of: ${VALID_STATUSES.join(", ")}.`;
  }

  return null;
}

/*
  Find the next available course ID.

  IDs start at 1. If there are no courses, the next ID is 1.
  Otherwise, the highest existing ID is found and increased by 1.
*/
function getNextCourseId(courses) {
  if (courses.length === 0) {
    return 1;
  }

  const highestId = courses.reduce((highest, course) => {
    const courseId = Number(course.id);

    if (Number.isInteger(courseId) && courseId > highest) {
      return courseId;
    }

    return highest;
  }, 0);

  return highestId + 1;
}

/*
  POST /api/courses

  Add a new course.
*/
app.post("/api/courses", async (req, res, next) => {
  try {
    const validationError = validateCourseData(req.body);

    if (validationError) {
      return res.status(400).json({
        error: validationError
      });
    }

    const courses = await readCoursesFile();
    const now = new Date().toISOString();

    const newCourse = {
      id: getNextCourseId(courses),
      name: req.body.name.trim(),
      description: req.body.description.trim(),
      target_date: req.body.target_date,
      status: req.body.status,
      created_at: now
    };

    courses.push(newCourse);

    await writeCoursesFile(courses);

    return res.status(201).json(newCourse);
  } catch (error) {
    next(error);
  }
});

/*
  GET /api/courses

  Return all courses.
*/

/*
  GET /api/courses/stats

  Return the total number of courses
  and a breakdown by status.
*/
app.get("/api/courses/stats", async (req, res, next) => {
  try {
    const courses = await readCoursesFile();

    const stats = {
      total_courses: courses.length,
      by_status: {
        "Not Started": 0,
        "In Progress": 0,
        "Completed": 0
      }
    };

    courses.forEach((course) => {
      if (Object.prototype.hasOwnProperty.call(
        stats.by_status, course.status
      )) {
        stats.by_status[course.status]++;
      }
    });

    return res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
});

app.get("/api/courses", async (req, res, next) => {
  try {
    const courses = await readCoursesFile();

    return res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
});

/*
  GET /api/courses/:id

  Return one course by its numeric ID.
*/
app.get("/api/courses/:id", async (req, res, next) => {
  try {
    const courses = await readCoursesFile();
    const courseId = Number(req.params.id);

    const course = courses.find((item) => item.id === courseId);

    if (!course) {
      return res.status(404).json({
        error: "Course not found."
      });
    }

    return res.status(200).json(course);
  } catch (error) {
    next(error);
  }
});

/*
  PUT /api/courses/:id

  Replace all editable fields for an existing course.

  The ID and created_at values cannot be changed by the client.
*/
app.put("/api/courses/:id", async (req, res, next) => {
  try {

    const courses = await readCoursesFile();
    const courseId = Number(req.params.id);

    const courseIndex = courses.findIndex(
      (course) => course.id === courseId
    );

    if (courseIndex === -1) {
      return res.status(404).json({
        error: "Course not found."
      });
    }

    const existingCourse = courses[courseIndex];

    // Keep existing values for fields not provided
    const updatedCourse = {
      ...existingCourse,
      ...req.body,
      id: existingCourse.id,
      created_at: existingCourse.created_at
    };

    // Validate the complete updated course
    const validationError = validateCourseData(updatedCourse);

    if (validationError) {
      return res.status(400).json({
        error: validationError
      });
    }

    updatedCourse.name = updatedCourse.name.trim();
    updatedCourse.description = updatedCourse.description.trim();

    courses[courseIndex] = updatedCourse;

    await writeCoursesFile(courses);

    return res.status(200).json(updatedCourse);
  } catch (error) {
    next(error);
  }
});


/*
  DELETE /api/courses/:id

  Delete an existing course.
*/
app.delete("/api/courses/:id", async (req, res, next) => {
  try {
    const courses = await readCoursesFile();
    const courseId = Number(req.params.id);

    const courseIndex = courses.findIndex(
      (item) => item.id === courseId
    );

    if (courseIndex === -1) {
      return res.status(404).json({
        error: "Course not found."
      });
    }

    const deletedCourse = courses.splice(courseIndex, 1)[0];

    await writeCoursesFile(courses);

    return res.status(200).json({
      message: "Course deleted successfully.",
      course: deletedCourse
    });
  } catch (error) {
    next(error);
  }
});

/*
  Handle malformed JSON request bodies.

  For example, this catches invalid JSON sent in a POST request.
*/
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      error: "The request body contains invalid JSON."
    });
  }

  next(error);
});

/*
  Handle requests to routes that do not exist.
*/
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found."
  });
});

/*
  General error-handling middleware.

  All errors passed to next(error) eventually arrive here.
*/
app.use((error, req, res, next) => {
  console.error(error);

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    error: error.message || "An unexpected server error occurred."
  });
});

/*
  Start the server.
*/
app.listen(PORT, () => {
  console.log(`CodeCraftHub API is running on http://localhost:${PORT}`);
  console.log(`Course data is stored in: ${COURSES_FILE}`);
});