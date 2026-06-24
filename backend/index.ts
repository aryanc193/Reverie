import mongoose from "mongoose";
import createApp from "./app";
import { env } from "./config/env";

const app = createApp();

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
