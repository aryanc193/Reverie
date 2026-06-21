import dotenv from "dotenv";
import mongoose from "mongoose";
import { env } from "../config/env";
import { processPendingMemories } from "../services/reflection.service";

dotenv.config();

async function poll() {
  try {
    const processed = await processPendingMemories();
    if (processed.length > 0) {
      console.log(`Processed ${processed.length} memories`);
    }
  } catch (err) {
    console.error("Reflection worker error:", err);
  }
}

mongoose
  .connect(env.databaseUrl)
  .then(() => {
    console.log("Reflection worker connected to Mongo");
    void poll();
    setInterval(() => {
      void poll();
    }, env.reflectionPollIntervalMs);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
