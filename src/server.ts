import express from "express";
import cors from "cors";
import mongoose from "mongoose";

async function main() {
	// requirements
	const port = process.env.PORT || 4000;

	// express configuration
	const app = express();
	app.use(express.json());
	app.use(cors());

	try {
		await mongoose.connect("mongodb://127.0.0.1:27017/ocr");
		mongoose.connection.on("connected", () => {
			console.log("Dabase connected!");
		});

		app.listen(port, () => {
			console.log("Server is running on port: ", port);
		});
	} catch (error) {
		throw error;
	}
	// Database connection
}

main()
	.then(() => {
		console.log("Server started!");
	})
	.catch((error) => {
		console.error("An error occured", error);
	});
