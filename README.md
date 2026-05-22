# 🚀 Job Management System

A full-stack SaaS platform for managing outsourced job application workflows between clients and recruitment associates.

The platform provides subscription management, secure payment integration, real-time communication, role-based workflows, and scalable backend infrastructure for handling job tracking operations efficiently.

---

## ✨ Features

- 🔐 JWT Authentication & Role-Based Access Control
- 💼 Client & Associate Workflow Management
- 💳 Razorpay Payment Integration
- 📦 Subscription & Plan Management
- ⚡ Redis Caching (Cache-Aside Pattern)
- 💬 Real-Time Chat using Socket.io
- 📄 Filtering, Search & Pagination
- 🛡️ Protected Routes & Middleware Authorization
- 🚀 Scalable REST API Architecture
- 🧠 Centralized Error Handling

---

## 🏗️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Redis
- JWT Authentication
- Razorpay
- Socket.io

### Frontend
- React.js
- TypeScript
- Tailwind CSS
- React Query
- Axios

---

## 🧠 System Architecture

### Authentication & Authorization
- JWT-based authentication
- Middleware-driven route protection
- Role-based access control for Clients & Associates

### Payment Infrastructure
Integrated Razorpay payment flow with:

- Order creation
- Secure checkout
- Backend payment verification
- Pending payment tracking
- Signature validation

### Redis Caching
Implemented:
- Cache-Aside Pattern
- Key-Based Cache Invalidation
- Optimized dashboard queries

This reduces repeated database calls and improves response times.

---

## 📂 Project Structure

```plaintext
job-management-system/
│
├── job-platform-backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── validators/
│   │
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
```

---

## 🔑 Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

REDIS_URL=your_redis_url

RAZORPAY_KEY_ID=your_key

RAZORPAY_KEY_SECRET=your_secret

CLIENT_URL=your_frontend_url
```

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/job-management-system.git
```

### Install Backend Dependencies

```bash
cd job-platform-backend
npm install
```

### Run Backend

```bash
npm run dev
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Run Frontend

```bash
npm run dev
```

---

## 📡 Core Modules

- Authentication
- Payments
- Plans & Subscriptions
- Job Management
- Associate Assignment
- Messaging System
- Protected Dashboard Operations

---

## 📈 Future Improvements

- Webhook-driven subscription lifecycle management
- Admin analytics dashboard
- Queue-based background processing
- Resume parsing workflows
- Notification infrastructure
- Activity audit logs

---

## 🧠 Key Learnings

This project helped strengthen understanding of:

- SaaS workflow architecture
- Secure payment systems
- Redis caching strategies
- Real-time communication systems
- Authentication & authorization
- API scalability patterns
- Backend system design

---

## 📌 Author

**Nishanth Rao**

---

## ⚠️ Note

This project is actively evolving with a focus on building scalable backend systems and production-grade SaaS architecture.