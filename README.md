# 🚀 Job Management System (Backend)

A scalable backend system for managing job application services where associates apply to jobs on behalf of clients and track daily activities.

---

## 📌 Overview

This project is a backend system built using **Node.js, Express, MongoDB**, and **JWT authentication**.

It enables a structured workflow where:

* Clients subscribe to a service
* Associates manage job applications for clients
* All activities (applications, resumes, cover letters) are tracked and visible

---

## 🧠 Problem It Solves

Job application tracking is often unstructured and chaotic.

This system provides:

* Centralized tracking of applications
* Transparency between clients and associates
* Daily activity logging
* Scalable backend architecture

---

## ⚙️ Tech Stack

* **Backend:** Node.js, Express
* **Database:** MongoDB (Mongoose)
* **Authentication:** JWT (JSON Web Tokens)
* **Security:** bcrypt (password hashing)
* **Environment Management:** dotenv

---

## 🏗️ Project Structure

```
job-platform-backend/
│
├── src/
│   ├── config/        # Database configuration
│   ├── models/        # Mongoose schemas
│   ├── controllers/   # Business logic
│   ├── routes/        # API routes
│   ├── middleware/    # Auth & role-based middleware
│
├── .env               # Environment variables (not committed)
├── .env.example       # Sample env file
├── server.js          # Entry point
├── package.json
```

---

## 🔐 Features Implemented

### ✅ Authentication System

* User registration (Client)
* Secure login using JWT
* Password hashing with bcrypt

### ✅ Authorization

* Protected routes using middleware
* Role-based access control (client / associate / admin)

### ✅ Database Integration

* MongoDB connection using Mongoose
* User schema with role relationships

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

## 🚀 Getting Started

### 1. Clone the repository

```
git clone https://github.com/YOUR_USERNAME/job-management-system.git
cd job-management-system/job-platform-backend
```

### 2. Install dependencies

```
npm install
```

### 3. Run the server

```
npm run dev
```

---

## 🧪 API Endpoints

### 🔹 Auth Routes

| Method | Endpoint           | Description     |
| ------ | ------------------ | --------------- |
| POST   | /api/auth/register | Register client |
| POST   | /api/auth/login    | Login user      |

---

### 🔹 Test Routes

| Method | Endpoint                 | Description           |
| ------ | ------------------------ | --------------------- |
| GET    | /api/test/protected      | Protected route (JWT) |
| GET    | /api/test/associate-only | Role-based access     |

---

## 🔒 Authentication Usage

Send JWT token in headers:

```
Authorization: Bearer <your_token>
```

---

## 🧠 Future Improvements

* Job management APIs (core feature)
* Activity tracking per job
* Associate-client assignment logic
* Dashboard analytics
* Chrome extension integration
* Payment & subscription system

---

## 📈 Learning Outcome

This project demonstrates:

* Backend architecture design
* Authentication & authorization
* REST API development
* Secure coding practices
* Real-world problem solving

---

## 🤝 Contribution

This is a personal learning project. Contributions and suggestions are welcome.

---

## 📌 Author

**Nishanth**

---

## ⚡ Note

This project is being built from scratch with a focus on understanding system design and backend fundamentals rather than relying on generated code.
