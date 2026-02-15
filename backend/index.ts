import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./auth/auth.routes";
import memoryRoutes from "./memory/memory.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/memories", memoryRoutes);
app.use("/api/v1/auth", authRoutes);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.DATABASE_CONNECTION_STRING as string)
  .then(() => {
    console.log("Mongo connected");

    app.listen(PORT, () => {
      console.log("Server running on", PORT);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
