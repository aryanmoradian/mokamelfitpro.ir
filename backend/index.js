import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "./middleware/auto.js";
import aiRouter from "./routes/ai.js";
import { GoogleGenAI } from "@google/genai";

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

// ======================
// CORS CONFIG
// ======================
const allowedOrigins = [
  "http://localhost:5173",
  "https://mokamelfitpro-ir-1.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ======================
// HEALTH CHECK
// ======================
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ======================
// USERS ROUTE
// ======================
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, createdAt: true },
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ======================
// PROTECTED ROUTE EXAMPLE
// ======================
app.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true, createdAt: true },
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// ======================
// AI ROUTES
// ======================
app.use("/api", aiRouter);

// ======================
// GRACEFUL SHUTDOWN
// ======================
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// ======================
// START SERVER
// ======================
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
