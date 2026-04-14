require("dotenv").config();
const express = require('express');
const connectDB = require("./src/config/db");

//Intialize app and connect to DB
const app = express();
connectDB();

//Middleware
app.use(express.json());

//Routes
const authRoutes = require("./src/routes/authRoutes");
const testRoutes = require("./src/routes/testRoutes");

app.use("/api/auth",authRoutes);
app.use("/api/test",testRoutes);

//For any req starting with /api/auth, use the routes defined in authRoutes
app.use("/api/auth",authRoutes);
app.get('/api/test', (req, res) => {
  res.send('API is working');
});

PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
