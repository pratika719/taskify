# 📝 Taskify

A RESTful Task Management API built with **Node.js**, **Express**, and **MongoDB**. Taskify allows users to register, log in, create and manage their personal tasks, while providing admins privileged access to oversee all users and their tasks.

---

## 🚀 Features

- **User Authentication** — Register & login with secure bcrypt-hashed passwords
- **JWT-based Sessions** — Auth tokens stored in HTTP-only cookies (7-day expiry)
- **Task Management** — Create, read, update, and delete personal tasks
- **Role-based Access Control** — Admin middleware that restricts privileged endpoints
- **Admin Dashboard API** — Admins can list all users, delete users, and view any user's tasks
- **Flash Messages** — User-friendly feedback via `connect-flash`

---

## 🛠️ Tech Stack

| Layer        | Technology                          |
|--------------|--------------------------------------|
| Runtime      | Node.js                              |
| Framework    | Express.js v5                        |
| Database     | MongoDB (via Mongoose v9)            |
| Auth         | JSON Web Tokens (`jsonwebtoken`)     |
| Password     | `bcrypt`                             |
| Cookies      | `cookie-parser`                      |
| Flash Msgs   | `connect-flash`                      |
| Config       | `dotenv`                             |

---

## 📁 Project Structure

```
taskify/
├── app.js                          # Entry point — Express app setup & route mounting
├── package.json
├── .env                            # Environment variables (not committed)
├── .gitignore
│
├── config/
│   └── mongoose-connections.js     # MongoDB connection setup
│
├── models/
│   ├── user-model.js               # User schema (name, email, password, tasks[])
│   ├── task-model.js               # Task schema (title, desc, status, author)
│   └── admin-model.js              # Admin schema (fullname, email, password)
│
├── controllers/
│   └── authcontrollers.js          # registerUser, loginuser, logout handlers
│
├── routes/
│   ├── index.js                    # Root route (GET /)
│   ├── usersRouter.js              # Auth routes: /users/register, /users/login, /users/logout
│   ├── taskRoutes.js               # Task CRUD routes under /task
│   └── adminRoutes.js              # Admin-only routes under /admin
│
├── middlewares/
│   ├── loggedin.js                 # JWT verification middleware (protects private routes)
│   └── isadmin.js                  # Admin check middleware (checks against Admin collection)
│
└── utils/
    └── generatetoken.js            # JWT token generation utility
```

---

## 📦 Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally on port `27017`

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/taskify.git
cd taskify

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your own values

# 4. Start the server
node app.js
```

The server will start on **http://localhost:3000**

---

## ⚙️ Environment Variables

Create a `.env` file in the project root with the following keys:

```env
JWT_KEY=your_jwt_secret_key
EXPRESS_SESSION_SECRET=your_session_secret
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 🔌 API Endpoints

### 🔐 Auth — `/users`

| Method | Endpoint           | Description              | Auth Required |
|--------|--------------------|--------------------------|---------------|
| POST   | `/users/register`  | Register a new user      | ❌             |
| POST   | `/users/login`     | Login & receive JWT cookie | ❌           |
| GET    | `/users/logout`    | Logout (clears cookie)   | ❌             |

#### `POST /users/register`
```json
// Request Body
{
  "name": "Pratik",
  "email": "pratik@example.com",
  "password": "securepassword"
}
```

#### `POST /users/login`
```json
// Request Body
{
  "email": "pratik@example.com",
  "password": "securepassword"
}

// Response
{
  "message": "Login successful",
  "userId": "<mongo_user_id>"
}
```

---

### ✅ Tasks — `/task`

> All task routes require a valid JWT cookie (`loggedin` middleware).

| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| GET    | `/task/`              | Get all tasks for the logged-in user |
| POST   | `/task/create`        | Create a new task                  |
| DELETE | `/task/delete/:id`    | Delete a task by ID                |
| PATCH  | `/task/edit/:id`      | Update a task by ID                |

#### `POST /task/create`
```json
// Request Body
{
  "title": "Buy groceries",
  "desc": "Milk, eggs, bread"
}

// Response (201)
{
  "message": "Task created successfully",
  "task": {
    "_id": "...",
    "title": "Buy groceries",
    "desc": "Milk, eggs, bread",
    "status": false,
    "author": "<userId>"
  }
}
```

#### `PATCH /task/edit/:id`
```json
// Request Body (all fields optional)
{
  "title": "Buy groceries (updated)",
  "desc": "Also get juice",
  "status": true
}
```

---

### 🛡️ Admin — `/admin`

> Admin routes require both `loggedin` AND `isadmin` middleware.  
> A user is considered an admin if their email exists in the **Admin** collection in MongoDB.

| Method | Endpoint                  | Description                        |
|--------|---------------------------|------------------------------------|
| GET    | `/admin/allusers`         | Get all registered users           |
| DELETE | `/admin/delusers/:userid` | Delete a user by ID                |
| GET    | `/admin/:userid/tasks`    | Get all tasks belonging to a user  |

---

## 🗃️ Data Models

### User
```js
{
  name: String,
  email: String,
  password: String,       // bcrypt hashed
  tasks: [ObjectId]       // refs to Task documents
}
```

### Task
```js
{
  title: String,
  desc: String,
  status: Boolean,        // false = incomplete, true = complete
  author: ObjectId        // ref to User
}
```

### Admin
```js
{
  fullname: String,
  email: String,
  password: String
}
```

---

## 🔒 Authentication Flow

```
Client                        Server
  |                              |
  |-- POST /users/register  --> |  Hash password with bcrypt
  |                              |  Create user in DB
  |                              |  Sign JWT (userId, email, 7d expiry)
  |<-- Set-Cookie: token=... ---|
  |                              |
  |-- POST /users/login     --> |  Verify credentials
  |                              |  Sign JWT
  |<-- Set-Cookie: token=... ---|
  |                              |
  |-- GET /task/ (+ cookie) --> |  loggedin middleware verifies JWT
  |                              |  Attach decoded user to req.user
  |<-- 200 tasks JSON       ----|
```

---

## 🧪 Testing with Postman

1. Register a user via `POST /users/register`
2. Login via `POST /users/login` — the JWT cookie is auto-set
3. Use `POST /task/create` to create tasks
4. List tasks with `GET /task/`
5. Edit a task with `PATCH /task/edit/:id`
6. Delete a task with `DELETE /task/delete/:id`

> To test admin endpoints, manually insert a document into the `admins` collection in MongoDB with the same email as a logged-in user.

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👤 Author

**Pratik**  
Feel free to contribute, open issues, or fork this project!

