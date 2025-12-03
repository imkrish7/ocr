import mongoose from "mongoose";
import { documentWorker } from "./workers/documentWorker.ts";

async function main() {
  const mongouri = process.env.DATABASE_URI || "";
  try {
    if (!mongouri) throw new Error("Missing database URI");
    await mongoose.connect(mongouri);
    mongoose.connection.on("connected", () => {
      console.log("Database connected!");
    });

    mongoose.connection.on("error", (error) => {
      console.error(error);
    });

    await documentWorker.run();
  } catch (error) {
    throw error;
  }
}

main()
  .then(() => {
    console.log("Worker started!");
  })
  .catch((error) => {
    console.error(error);
  });
