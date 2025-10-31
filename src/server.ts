import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { signPayload } from "./core/auth.js";

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
