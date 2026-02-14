import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./auth/auth.routes";
import memoryRoutes from "./memory/memory.routes";

dotenv.config();

mongoose
  .connect(process.env.DATABASE_CONNECTION_STRING as string)
  .then(() => {
    console.log("Mongo connected");

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log("API listening on", PORT);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

const app = express();
app.use(cors());
app.use(express.json());
app.use("/memories", memoryRoutes);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("API listening on", PORT);
});
