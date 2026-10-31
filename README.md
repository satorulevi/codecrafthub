CodeCraftHub
CodeCraftHub is a beginner-friendly REST API for tracking personal learning goals and courses. It is built with Node.js and Express and stores course data in a local
courses.json
file instead of using a database.

The API runs on port
5000
.

Features
Create, view, update, and delete courses
Automatically generated numeric course IDs
Required course field validation
Course status validation
YYYY-MM-DD
target date validation
Automatically generated creation timestamps
Automatic creation of
courses.json
JSON-based file storage
Helpful HTTP error responses
No authentication or user management
Technologies
Node.js
Express
JSON file storage
Project Structure
codecrafthub/
├── app.js
├── courses.json
├── package.json
└── README.md
The
courses.json
file is created automatically when the application starts or receives its first request if it does not already exist.

Course Format
Each course contains the following fields:

Field	Description
id
Automatically generated numeric ID
name
Course name
description
Course description
target_date
Target completion date in
YYYY-MM-DD
format
status
Not Started
,
In Progress
, or
Completed
created_at
Automatically generated ISO timestamp
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
Download and install Node.js from:

https://nodejs.org/
Verify that Node.js and npm are installed:

node --version
npm --version
2. Clone or download the project
Open a terminal in the project directory:

cd codecrafthub
3. Install dependencies
Install Express using the existing
package.json
file:

npm install
Running the Application
Start the server with:

npm start
The API will be available at:

http://localhost:5000
You should see a message similar to:

CodeCraftHub API is running on http://localhost:5000
The course data is stored in:

courses.json
To stop the server, press:

Ctrl + C
API Documentation
The base URL is:

http://localhost:5000
All request bodies must use JSON and include the following header:

Content-Type: application/json
Create a Course
Request
POST /api/courses
Example using
curl
:

curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Express.js Basics",
    "description": "Learn how to build REST APIs with Express.",
    "target_date": "2026-12-31",
    "status": "Not Started"
  }'
Request Body
{
  "name": "Express.js Basics",
  "description": "Learn how to build REST APIs with Express.",
  "target_date": "2026-12-31",
  "status": "Not Started"
}
The
id
and
created_at
fields are generated automatically.

Successful Response
Status:
201 Created

{
  "id": 1,
  "name": "Express.js Basics",
  "description": "Learn how to build REST APIs with Express.",
  "target_date": "2026-12-31",
  "status": "Not Started",
  "created_at": "2026-10-30T12:00:00.000Z"
}
Possible Errors
Status:
400 Bad Request

{
  "error": "The name field is required."
}
{
  "error": "The status must be one of: Not Started, In Progress, Completed."
}
{
  "error": "The target_date must use the format YYYY-MM-DD and be a valid date."
}
Get All Courses
Request
GET /api/courses
Example:

curl http://localhost:5000/api/courses
Successful Response
Status:
200 OK

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
Get a Specific Course
Request
GET /api/courses/:id
Replace
:id
with the numeric course ID.

Example:

curl http://localhost:5000/api/courses/1
Successful Response
Status:
200 OK

{
  "id": 1,
  "name": "Express.js Basics",
  "description": "Learn how to build REST APIs with Express.",
  "target_date": "2026-12-31",
  "status": "Not Started",
  "created_at": "2026-10-30T12:00:00.000Z"
}
Course Not Found
Status:
404 Not Found

{
  "error": "Course not found."
}
Update a Course
The
PUT
endpoint replaces the editable course information. All required fields must be included in the request.

The existing
id
and
created_at
values are preserved.

Request
PUT /api/courses/:id
Example:

curl -X PUT http://localhost:5000/api/courses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Advanced Express.js",
    "description": "Build more advanced REST APIs with Express.",
    "target_date": "2027-01-31",
    "status": "In Progress"
  }'
Request Body
{
  "name": "Advanced Express.js",
  "description": "Build more advanced REST APIs with Express.",
  "target_date": "2027-01-31",
  "status": "In Progress"
}
Successful Response
Status:
200 OK

{
  "id": 1,
  "name": "Advanced Express.js",
  "description": "Build more advanced REST APIs with Express.",
  "target_date": "2027-01-31",
  "status": "In Progress",
  "created_at": "2026-10-30T12:00:00.000Z"
}
Possible Errors
Status:
400 Bad Request

{
  "error": "The description field is required."
}
Status:
404 Not Found

{
  "error": "Course not found."
}
Delete a Course
Request
DELETE /api/courses/:id
Example:

curl -X DELETE http://localhost:5000/api/courses/1
Successful Response
Status:
200 OK

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
Course Not Found
Status:
404 Not Found

{
  "error": "Course not found."
}
Valid Status Values
The
status
field must contain exactly one of these values:

Not Started
In Progress
Completed
Examples:

{
  "status": "Not Started"
}
{
  "status": "In Progress"
}
{
  "status": "Completed"
}
Valid Target Dates
The
target_date
field must use the
YYYY-MM-DD
format.

Valid example:

2026-12-31
Invalid examples:

12/31/2026
2026-12-1
December 31, 2026
The application also checks whether the date is a real calendar date.

Error Responses
Invalid JSON
If a request contains malformed JSON, the API returns:

Status:
400 Bad Request

{
  "error": "The request body contains invalid JSON."
}
Unknown Route
If an endpoint does not exist, the API returns:

Status:
404 Not Found

{
  "error": "Route not found."
}
File Read or Write Error
If the application cannot read or write
courses.json
, it returns an error such as:

Status:
500 Internal Server Error

{
  "error": "Unable to read courses.json."
}
or:

{
  "error": "Unable to write to courses.json."
}
Troubleshooting
npm: command not found
Node.js and npm may not be installed. Install Node.js from:

https://nodejs.org/
Then verify the installation:

node --version
npm --version
Cannot find module 'express'
Install the project dependencies:

npm install
Then start the application again:

npm start
Port 5000 is already in use
Another application may already be using port
5000
.

On macOS or Linux, find the process using the port:

lsof -i :5000
On Windows, use:

netstat -ano | findstr :5000
Stop the other application, then run:

npm start
The current application is configured to use port
5000
.

courses.json
contains invalid JSON
The application expects
courses.json
to contain a JSON array.

A valid empty file looks like this:

[]
If the file contains invalid data, replace its contents with:

[]
Be aware that this removes the courses currently stored in the file.

Course data is not being saved
Check the following:

Confirm that
courses.json
exists or can be created.
Make sure the application has permission to write to the project directory.
Check the terminal for file read or write error messages.
Make sure
courses.json
contains valid JSON.
A request returns “Course not found”
Check that:

The course ID exists.
The ID is numeric.
You are using the correct URL.
Example:

curl http://localhost:5000/api/courses/1
Important Notes
This project uses a local JSON file instead of a database.
The API does not include authentication or user management.
All users would share the same course data if the API were deployed.
The JSON file is intended for learning and small local projects, not high-traffic production use.
23.00 seconds