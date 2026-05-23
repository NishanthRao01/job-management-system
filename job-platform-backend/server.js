require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");

const connectDB = require("./src/config/db");
const Message = require("./src/models/Message");

// Route Imports
const authRoutes = require("./src/routes/authRoutes");
const testRoutes = require("./src/routes/testRoutes");
const jobRoutes = require("./src/routes/jobRoutes");
const subscriptionRoutes = require("./src/routes/subscriptionRoutes");
const planRoutes = require("./src/routes/planRoutes");
const userRoutes = require("./src/routes/userRoutes");
const messageRoutes = require("./src/routes/messageRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

// Middleware
const errorHandler = require("./src/middleware/errorMiddleware");

//cron for job expiry
const runSubscriptionExpiryJob =
    require("./src/cron/subscriptionExpiryJob");

// Initialize Express App
const app = express();
const server = http.createServer(app);

// SECURITY MIDDLEWARE


app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Too many requests, please try again later",
  })
);


// CORS CONFIG

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// BODY PARSER

app.use(express.json());


// API ROUTES

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);


// HEALTH CHECK

app.get("/api/test", (req, res) => {
  res.send("API is working");
});


// SOCKET.IO SETUP

try {
  const { Server } = require("socket.io");

  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const onlineUsers = new Map();

  // Socket Authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  // Socket Events
  io.on("connection", (socket) => {
    const userId = socket.user.userId;

    onlineUsers.set(userId, socket.id);

    console.log(`User connected: ${userId}`);

    socket.on("sendMessage", async (data) => {
      try {
        const { receiverId, text } = data;

        const message = await Message.create({
          senderId: userId,
          receiverId,
          text,
        });

        // Send message to receiver if online
        const receiverSocketId = onlineUsers.get(receiverId);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", message);
        }

        // Send message back to sender
        socket.emit("receiveMessage", message);

      } catch (err) {
        console.error("Socket send error:", err);
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      console.log(`User disconnected: ${userId}`);
    });
  });

  console.log("Socket.io chat enabled");

} catch (err) {
  console.log("Socket.io not installed — chat disabled");
}


// ERROR HANDLER

app.use(errorHandler);


// SERVER START

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

startServer();
runSubscriptionExpiryJob();