require("dotenv").config();
const express = require('express');
const connectDB = require("./src/config/db");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

//Intialize app and connect to DB
const app = express();
connectDB();

//Middleware
app.use(express.json());

//Routes
const authRoutes = require("./src/routes/authRoutes");
const testRoutes = require("./src/routes/testRoutes");
const jobRoutes = require("./src/routes/jobRoutes");
const subscriptionRoutes = require("./src/routes/subscriptionRoutes");
const errorHandler = require("./src/middleware/errorMiddleware");

app.use("/api/auth",authRoutes);
app.use("/api/test",testRoutes);
app.use("/api/jobs",jobRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use(errorHandler);
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, //15 minutes
  max: 100, //max requests allowed per window
  message: "Too many requests, please try again later"
}));

//For any req starting with /api/auth, use the routes defined in authRoutes
app.use("/api/auth",authRoutes);
app.get('/api/test', (req, res) => {
  res.send('API is working');
});

PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
