import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./auth/auth.routes";
import memoryRoutes from "./memory/memory.routes";
import insightRoutes from "./insight/insight.routes";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error-handler";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/memories", memoryRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/insights", insightRoutes);

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
