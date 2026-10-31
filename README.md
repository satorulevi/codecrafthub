CodeCraftHub
CodeCraftHub is a beginner-friendly REST API for tracking personal learning goals and courses. It is built with Node.js and Express and stores course data in a local courses.json file instead of using a database.

The API runs on port 5000.
Features
- Create, view, update, and delete courses (CRUD).
- Automatically generate numeric course IDs and creation timestamps.
- Validate required course fields and allowed status values.
- Validate target dates in YYYY-MM-DD format, including real calendar dates.
- Automatically create courses.json if it does not exist.
- Store data in a local JSON file without a database.
- Return helpful HTTP error responses.
- Run without authentication or user management.
Technologies
- Node.js
- Express
- JSON file storage
Project Structure
codecrafthub/
├── app.js
├── courses.json
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
courses.json is created automatically when the application first needs it, if it does not already exist. The node_modules/ directory is created when you install dependencies and should not be committed to Git.
Course Format
Each course contains these fields:
Field	Description
id	Automatically generated numeric ID
name	Course name (required)
description	Course description (required)
target_date	Target completion date in YYYY-MM-DD format (required)
status	Not Started, In Progress, or Completed (required)
created_at	Automatically generated ISO timestamp


Example course:
{
  "id": 1,
  "name": "Express.js Basics",
  "description": "Learn how to build REST APIs with Express.",
  "target_date": "2026-12-31",
  "status": "Not Started",
  "created_at": "2026-10-30T12:00:00.000Z"
}
Installation
1. Install Node.js
Download and install Node.js from nodejs.org.

Open a terminal and verify that Node.js and npm are installed:
node --version
npm --version
2. Get the project
Clone the GitHub repository:
git clone https://github.com/satorulevi/codecrafthub.git
cd codecrafthub
If you have already downloaded or created the project, simply open its folder in VS Code and open a terminal there.
3. Install dependencies
npm install
This installs Express using the project's package.json file.
Running the Application
Start the server:
npm start
The API will be available at http://localhost:5000.

You should see a message similar to:
CodeCraftHub API is running on http://localhost:5000
Course data is stored in: /path/to/codecrafthub/courses.json
To stop the server, press Ctrl + C in the terminal.
Windows PowerShell note: If PowerShell blocks npm.ps1, try npm.cmd install and npm.cmd start, or use a Command Prompt terminal. The API examples below use curl; on Windows, use curl.exe in PowerShell.

API Documentation
Base URL: http://localhost:5000

For requests with a JSON body, include the header:
Content-Type: application/json
API Endpoints
Method	Endpoint	Purpose
POST	/api/courses	Create a course
GET	/api/courses	Get all courses
GET	/api/courses/:id	Get a course by ID
PUT	/api/courses/:id	Update a course
DELETE	/api/courses/:id	Delete a course


1. Create a Course
Request: POST /api/courses
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Express.js Basics",
    "description": "Learn how to build REST APIs with Express.",
    "target_date": "2026-12-31",
    "status": "Not Started"
  }'
Request body:
{
  "name": "Express.js Basics",
  "description": "Learn how to build REST APIs with Express.",
  "target_date": "2026-12-31",
  "status": "Not Started"
}
The id and created_at fields are generated automatically.

Successful response: 201 Created
{
  "id": 1,
  "name": "Express.js Basics",
  "description": "Learn how to build REST APIs with Express.",
  "target_date": "2026-12-31",
  "status": "Not Started",
  "created_at": "2026-10-30T12:00:00.000Z"
}
Possible errors: 400 Bad Request
{ "error": "The name field is required." }
{ "error": "The status must be one of: Not Started, In Progress, Completed." }
{ "error": "The target_date must use the format YYYY-MM-DD and be a valid date." }
2. Get All Courses
Request: GET /api/courses
curl http://localhost:5000/api/courses
Successful response: 200 OK
[
  {
    "id": 1,
    "name": "Express.js Basics",
    "description": "Learn how to build REST APIs with Express.",
    "target_date": "2026-12-31",
    "status": "Not Started",
    "created_at": "2026-10-30T12:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Node.js Fundamentals",
    "description": "Learn the core concepts of Node.js.",
    "target_date": "2027-01-15",
    "status": "In Progress",
    "created_at": "2026-10-30T12:05:00.000Z"
  }
]
If there are no courses, the response is an empty array:
[]
3. Get a Specific Course
Request: GET /api/courses/:id

Replace :id with the numeric course ID.
curl http://localhost:5000/api/courses/1
Successful response: 200 OK
{
  "id": 1,
  "name": "Express.js Basics",
  "description": "Learn how to build REST APIs with Express.",
  "target_date": "2026-12-31",
  "status": "Not Started",
  "created_at": "2026-10-30T12:00:00.000Z"
}
Course not found: 404 Not Found
{ "error": "Course not found." }
4. Update a Course
Request: PUT /api/courses/:id

The PUT endpoint replaces the editable course information. All required fields must be included in the request. The existing id and created_at values are preserved.
curl -X PUT http://localhost:5000/api/courses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Advanced Express.js",
    "description": "Build more advanced REST APIs with Express.",
    "target_date": "2027-01-31",
    "status": "In Progress"
  }'
Request body:
{
  "name": "Advanced Express.js",
  "description": "Build more advanced REST APIs with Express.",
  "target_date": "2027-01-31",
  "status": "In Progress"
}
Successful response: 200 OK
{
  "id": 1,
  "name": "Advanced Express.js",
  "description": "Build more advanced REST APIs with Express.",
  "target_date": "2027-01-31",
  "status": "In Progress",
  "created_at": "2026-10-30T12:00:00.000Z"
}
Possible errors:
- 400 Bad Request — { "error": "The description field is required." }
- 404 Not Found — { "error": "Course not found." }
5. Delete a Course
Request: DELETE /api/courses/:id
curl -X DELETE http://localhost:5000/api/courses/1
Successful response: 200 OK
{
  "message": "Course deleted successfully.",
  "course": {
    "id": 1,
    "name": "Express.js Basics",
    "description": "Learn how to build REST APIs with Express.",
    "target_date": "2026-12-31",
    "status": "Not Started",
    "created_at": "2026-10-30T12:00:00.000Z"
  }
}
Course not found: 404 Not Found
{ "error": "Course not found." }
Validation Rules
Valid Status Values
The status field must contain exactly one of these values:
- Not Started
- In Progress
- Completed
For example:
{ "status": "In Progress" }
Valid Target Dates
The target_date field must use YYYY-MM-DD format and represent a real calendar date.

Valid: 2026-12-31

Invalid: 12/31/2026, 2026-12-1, December 31, 2026, 2026-02-30
Error Responses
Condition	HTTP status	Example response
Missing or invalid required field	400	{ "error": "The name field is required." }
Malformed JSON request body	400	{ "error": "The request body contains invalid JSON." }
Course does not exist	404	{ "error": "Course not found." }
Unknown route	404	{ "error": "Route not found." }
File read failure	500	{ "error": "Unable to read courses.json." }
File write failure	500	{ "error": "Unable to write to courses.json." }


Troubleshooting
node or npm: command not found
Install Node.js from nodejs.org and reopen your terminal. Verify the installation:
node --version
npm --version
PowerShell blocks npm.ps1
In PowerShell, run the Windows command shim directly:
npm.cmd install
npm.cmd start
Alternatively, open a Command Prompt terminal in VS Code.
Cannot find module 'express'
Install the project dependencies and restart the application:
npm install
npm start
Port 5000 is already in use
Another application may already be using port 5000.

On Windows:
netstat -ano | findstr :5000
On macOS or Linux:
lsof -i :5000
Identify and stop the conflicting process, then run npm start again. The application is configured to use port 5000.
courses.json contains invalid JSON
The file must contain a JSON array. A valid empty file looks like:
[]
If you replace the file contents with [], all previously stored courses will be lost. Back up the file first if you want to keep its data.
Course data is not being saved
- Confirm that courses.json exists or can be created.
- Make sure the application has permission to write to the project directory.
- Check the terminal for file read or write error messages.
- Make sure courses.json contains valid JSON.
A request returns Course not found
- Check that the course ID exists and is numeric.
- Confirm that you are using the correct URL.
curl http://localhost:5000/api/courses/1
Important Notes
- This project uses a local JSON file instead of a database.
- The API does not include authentication or user management.
- If deployed, all users would share the same course data.
- JSON file storage is intended for learning and small local projects, not high-traffic production use.
- The curl examples above use Bash/macOS/Linux quoting. In Windows PowerShell, use curl.exe with PowerShell-compatible escaping or Invoke-RestMethod instead.
Project Repository
View CodeCraftHub on GitHub