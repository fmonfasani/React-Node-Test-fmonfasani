# React & Node.js Skill Test

## Estimated Time

- 60 min

## Requirements

- Bug fix to login without any issues (20min) <br/>
  There is no need to change or add login function.
  Interpret the code structure and set the correct environment by the experience of building projects. <br/>
  Here is a login information. <br/>
  ✓ email: admin@gmail.com  ✓ password: admin123

- Implement Restful API of "Meeting" in the both of server and client sides (40min)<br/>
  Focus Code Style and Code Optimization. <br/>
  Reference other functions.

# Solution:

## React & Node.js Skill Test

**Developer:** Federico Monfasani  
**Email:** fmonfasani@gmail.com  
**Date:** June 9, 2025  

## Overview

React & Node.js Technical Test Resolution - Complete Process

Initial Configuration and Diagnostics:

We started by installing all dependencies with npm install in the Server and Client folders, then attempted to launch both services. 
The server started successfully on port 5001 but displayed "Database Not connected," while the frontend ran smoothly on port 3000. 
This immediately indicated that the problem lay with the database connectivity.

Systematic Investigation with Grep:
To quickly map the project structure, we used grep -r with specific keywords. With grep -r "DATABASE\|JWT\|SECRET" , we found the 
connection configuration in Server/index.js. Then, grep -r "admin@gmail.com", revealed that the administrator user was automatically 
created in Server/db/config.js. Finally, grep -r "/login\|/auth" . --include="*.js" showed us the authentication system.
Following the flow from index.js to db/config.js, we confirmed that the server was attempting to connect to mongodb://127.0.0.1:27017 
(local address). By checking the dependencies in package.json, we confirmed the use of Express, Mongoose, and other standard technologies.

Troubleshooting the Database:
Issue: When testing mongod --dbpath /workspaces/data/db, we received "command not found," confirming that MongoDB was not installed locally. 
We decided to use MongoDB Atlas as a cloud alternative. We set up a free cluster, created a user with appropriate permissions, and established
access from any IP address. We created an .env file on the server with the Atlas connection string. Upon restarting the server, we saw
"Database Connected Successfully.." and "Admin created successfully.." confirming that both the connection and initialization worked correctly.

Authentication Validation and JWT Discovery:
We tested the login with the provided credentials (admin@gmail.com/admin123) using Thunder Client. The successful response included a specific 
token format, deducing that the system used JWT for authentication. This token would be required for all subsequent requests to protected endpoints.

Meeting API Implementation:
We discovered that although the structure for meetings (model, controller, and routes) existed, the implementations were empty. Following the 
user.js controller pattern, we implemented the five CRUD operations: index, add, view, edit, and deleteData. Each function included error handling, 
data validation, and consistent JSON responses. We implemented the corresponding routes in _routes.js, ensuring that each endpoint required 
authentication through the existing authentication middleware, maintaining the security of the system.

Final Testing and Validation:
We performed extensive testing with Thunder Client: we obtained a fresh token, systematically tested each endpoint (GET, POST, PUT, DELETE), 
and validated all CRUD operations. We faced some technical challenges, such as the authentication token format (without a "Bearer" prefix) and 
issues with populate references, which we resolved iteratively.

The end result was a complete implementation that met all requirements: functional login with the provided credentials and a Meetings API with 
full CRUD operations, JWT authentication, and adherence to existing project best practices.


# Technical Details - React & Node.js Skill Test

## Technology Stack Used
- **Backend:** Node.js + Express.js (port 5001)
- **Database:** MongoDB Atlas (cloud)
- **ODM:** Mongoose 7.2.4
- **Authentication:** JWT (jsonwebtoken)
- **Development:** Nodemon 2.0.22
- **Testing:** Thunder Client (VS Code extension)

## Task 1: Login Bug Fix

### Problem:
- Failed connection to `mongodb://127.0.0.1:27017`
- MongoDB not installed locally

### Solution:
```bash
# Created Server/.env file:
DB_URL=mongodb+srv://fmonfasani:password@cluster0.gtncljn.mongodb.net/
DB=Prolink
```

### Result:
- Admin user auto-created on first connection
- Working login: `admin@gmail.com` / `admin123`
- JWT token generated successfully

## Task 2: Meeting API REST

### Modified Files:
1. **`Server/controllers/meeting/meeting.js`** - Complete CRUD controller
2. **`Server/controllers/meeting/_routes.js`** - REST routes with auth
3. **`Server/.env`** - Database configuration

### API Endpoints Implemented:
```javascript
GET    /api/meeting           // List all meetings
POST   /api/meeting           // Create meeting
GET    /api/meeting/view/:id  // Get specific meeting
PUT    /api/meeting/edit/:id  // Update meeting
DELETE /api/meeting/delete/:id // Soft delete meeting
```

### Controller Functions:
- `index()` - Fetch meetings with soft delete filter
- `add()` - Create new meeting with JWT user validation
- `view()` - Get specific meeting by ID
- `edit()` - Update meeting data
- `deleteData()` - Soft delete (deleted: true)

### Authentication:
```javascript
// All endpoints require JWT token in Authorization header
Headers: {
  Authorization: "jwt_token_here"  // No "Bearer" prefix
  Content-Type: "application/json"
}
```

### Meeting Schema:
```javascript
{
  agenda: String (required),
  attendes: [ObjectId],
  attendesLead: [ObjectId], 
  location: String,
  related: String,
  dateTime: String,
  notes: String,
  createBy: ObjectId (required),
  timestamp: Date,
  deleted: Boolean (default: false)
}
```

## Testing Process

### 1. Login Test:
```bash
POST /api/user/login
Body: {
  "username": "admin@gmail.com",
  "password": "admin123"
}
Response: { "token": "jwt_token", "user": {...} }
```

### 2. CRUD Operations Test:
```bash
# Create Meeting
POST /api/meeting
Headers: Authorization: jwt_token
Body: {
  "agenda": "Test Meeting",
  "location": "Office",
  "notes": "Test notes"
}

# Get All Meetings
GET /api/meeting
Headers: Authorization: jwt_token

# Update Meeting
PUT /api/meeting/edit/meeting_id
Headers: Authorization: jwt_token
Body: { "agenda": "Updated Meeting" }

# Delete Meeting
DELETE /api/meeting/delete/meeting_id
Headers: Authorization: jwt_token
```

## Key Implementation Details

### Database Connection:
```javascript
// Server/index.js
const DATABASE_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017'
const DATABASE = process.env.DB || 'Prolink'
db(DATABASE_URL, DATABASE);
```

### Auth Middleware:
```javascript
// Server/middlewares/auth.js
const auth = (req, res, next) => {
    const token = req.headers.authorization; // Direct token, no "Bearer"
    const decode = jwt.verify(token, 'secret_key')
    req.user = decode
    next();
}
```

### Error Handling:
```javascript
try {
    // Database operations
} catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
}
```

## Results Summary

### Task 1 - Login Fix:
- ✅ MongoDB Atlas connection established
- ✅ Admin user auto-creation working
- ✅ JWT authentication functional

### Task 2 - Meeting API:
- ✅ 5 REST endpoints implemented
- ✅ CRUD operations complete
- ✅ JWT authentication on all endpoints
- ✅ Soft delete functionality
- ✅ Error handling and validation
- ✅ All endpoints tested and working

  
