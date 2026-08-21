import express from "express";
import dotenv from "dotenv";
import { userRouter } from "./src/routes/user.routes.js";

// Protected user/route Middleware
import { authenticationMiddleware } from "./src/middlewares/auth.middleware.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(authenticationMiddleware);

// Health check routes
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// API routes
app.use("/api/user", userRouter);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
