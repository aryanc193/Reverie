import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./auth/auth.routes";
import memoryRoutes from "./memory/memory.routes";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error-handler";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/memories", memoryRoutes);
app.use("/api/v1/auth", authRoutes);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use(errorHandler);

mongoose
  .connect(env.databaseUrl)
  .then(() => {
    console.log("Mongo connected");

    app.listen(env.port, () => {
      console.log("Server running on", env.port);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
