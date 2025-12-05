import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

// routes
import { authRoutes } from "./routes/auth.ts";
import { metricsRoutes } from "./routes/metrics.ts";
import { actionRoutes } from "./routes/action.ts";
import { webhookRoutes } from "./routes/webhooks.ts";
import { documentRoutes } from "./routes/document.ts";
import { userRoutes } from "./routes/user.ts";
import { folderRoutes } from "./routes/folders.ts";
import { sharedRoutes } from "./routes/shared.ts";
import { recentRoutes } from "./routes/recent.ts";
import { collectionIndex } from "./utils/collectionIndex.ts";
import { createIndex } from "./services/createIndexService.ts";

async function main() {
	// requirements
	const port = process.env.PORT || 4000;
	const mongouri = process.env.DATABASE_URI || "";

	// express configuration
	const app = express();
	app.use(express.json());
	app.use(
		cors({
			origin: "http://localhost:5173",
			credentials: true,
		}),
	);
	app.use(cookieParser());

	try {
		if (!mongouri) throw new Error("Missing database URI");
		await mongoose.connect(mongouri, {
			connectTimeoutMS: 100000,
		});
		// await createIndex();
		mongoose.connection.on("connected", () => {
			console.log("Database connected!");
		});

		mongoose.connection.on("error", (error) => {
			console.error("Connection Error");
			console.error(error);
		});

		app.use("/v1", metricsRoutes);
		app.use("/v1", documentRoutes);
		app.use("/v1/user", userRoutes);
		app.use("/v1/auth", authRoutes);
		app.use("/v1/action", actionRoutes);
		app.use("/v1/shared", sharedRoutes);
		app.use("/v1/folders", folderRoutes);
		app.use("/v1/recents", recentRoutes);
		app.use("/v1/webhooks", webhookRoutes);

		app.listen(port, () => {
			console.log("Server is running on port: ", port);
		});
	} catch (error) {
		throw error;
	}
}

main()
	.then(() => {
		console.log("Server started!");
	})
	.catch((error) => {
		console.error("An error occured", error);
	});
