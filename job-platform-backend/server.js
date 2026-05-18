require("dotenv").config();
const express = require('express');
const connectDB = require("./src/config/db");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const http = require("http");
const jwt = require("jsonwebtoken");
const Message = require("./src/models/Message");

//Intialize app and connect to DB
const app = express();
const server = http.createServer(app);

//Middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express.json());

//Routes
const authRoutes = require("./src/routes/authRoutes");
const testRoutes = require("./src/routes/testRoutes");
const jobRoutes = require("./src/routes/jobRoutes");
const subscriptionRoutes = require("./src/routes/subscriptionRoutes");
const planRoutes = require("./src/routes/planRoutes");
const userRoutes = require("./src/routes/userRoutes");
const messageRoutes = require("./src/routes/messageRoutes");
const errorHandler = require("./src/middleware/errorMiddleware");

app.use("/api/auth",authRoutes);
app.use("/api/test",testRoutes);
app.use("/api/jobs",jobRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use(errorHandler);
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, //15 minutes
  max: 100, //max requests allowed per window
  message: "Too many requests, please try again later"
}));

//For any req starting with /api/auth, use the routes defined in authRoutes
// app.use("/api/auth",authRoutes); // Duplicate removed
app.get('/api/test', (req, res) => {
  res.send('API is working');
});

// Socket.io Implementation (conditional — only if socket.io is installed)
let io = null;
try {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const onlineUsers = new Map(); // userId -> socketId

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication error"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.userId;
    onlineUsers.set(userId, socket.id);

    socket.on("sendMessage", async (data) => {
      try {
        const { receiverId, text } = data;
        
        const message = await Message.create({
          senderId: userId,
          receiverId,
          text
        });

        // Send to receiver if online
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", message);
        }
        
        // Also send back to sender to confirm
        socket.emit("receiveMessage", message);
      } catch (err) {
        console.error("Socket send error:", err);
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
    });
  });

  console.log("✅ Socket.io chat enabled");
} catch (err) {
  console.log("⚠️  Socket.io not installed — chat disabled. Run: npm install socket.io");
}

PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
