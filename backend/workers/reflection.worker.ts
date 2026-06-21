import mongoose from "mongoose";
import { env } from "../config/env";
import { processPendingMemories } from "../services/reflection.service";
import { countPendingMemories } from "../services/memory.service";

let consecutiveErrors = 0;

function getWorkerBackoffMs(): number {
  return Math.min(
    env.reflectionPollIntervalMs * Math.pow(2, consecutiveErrors),
    60_000,
  );
}

async function poll() {
  try {
    const pendingCount = await countPendingMemories();
    if (pendingCount === 0) {
      consecutiveErrors = 0;
      return;
    }

    const { processed, failed } = await processPendingMemories();

    if (processed.length > 0) {
      console.log(
        `Processed ${processed.length} memories: ${processed.map((m) => m._id).join(", ")}`,
      );
    }

    if (failed.length > 0) {
      console.warn(
        `Failed to process ${failed.length} memories: ${failed.join(", ")}`,
      );
    }

    consecutiveErrors = 0;
  } catch (err) {
    consecutiveErrors += 1;
    const backoffMs = getWorkerBackoffMs();
    console.error(
      `Reflection worker error (attempt ${consecutiveErrors}):`,
      err,
      `Next poll backoff: ${backoffMs}ms`,
    );
  }
}

async function startWorker() {
  console.log("Reflection worker started");
  console.log(`AI provider: ${env.aiProvider}`);
  console.log(`Poll interval: ${env.reflectionPollIntervalMs}ms`);

  let polling = false;

  const schedulePoll = () => {
    const delay =
      consecutiveErrors > 0
        ? getWorkerBackoffMs()
        : env.reflectionPollIntervalMs;

    setTimeout(async () => {
      if (polling) {
        schedulePoll();
        return;
      }

      polling = true;
      try {
        await poll();
      } finally {
        polling = false;
        schedulePoll();
      }
    }, delay);
  };

  await poll();
  schedulePoll();
}

mongoose
  .connect(env.databaseUrl)
  .then(() => {
    console.log("Reflection worker connected to Mongo");
    return startWorker();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
