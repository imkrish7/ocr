import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// routes
import { authRoutes } from "./routes/auth.ts";
import { metricsRoutes } from "./routes/metrics.ts";
import { actionRoutes } from "./routes/action.ts";
import { webhookRoutes } from "./routes/webhooks.ts";
import { documentRoutes } from "./routes/document.ts";

async function main() {
	// requirements
	const port = process.env.PORT || 4000;

	// express configuration
	const app = express();
	app.use(express.json());
	app.use(cors());

	try {
		await mongoose.connect(
			"mongodb://root:root123@127.0.0.1:27018/ocr?authSource=admin"
		);
		mongoose.connection.on("connected", () => {
			console.log("Database connected!");
		});

		mongoose.connection.on("error", (error) => {
			console.error(error);
		});

		app.use("/v1", documentRoutes);
		app.use("/v1", metricsRoutes);
		app.use("/v1/auth", authRoutes);
		app.use("/v1/action", actionRoutes);
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
