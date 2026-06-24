import express from "express";
import cors from "cors";
import authRoutes from "./auth/auth.routes";
import memoryRoutes from "./memory/memory.routes";
import insightRoutes from "./insight/insight.routes";
import conversationRoutes from "./conversation/conversation.routes";
import { errorHandler } from "./middleware/error-handler";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/api/v1/memories", memoryRoutes);
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/insights", insightRoutes);
  app.use("/api/v1/conversations", conversationRoutes);

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use(errorHandler);
  return app;
}

export default createApp;
