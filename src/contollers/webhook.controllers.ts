import type { Request, Response } from "express";
import { webhookSchema } from "../schema/webhook.ts";

export const ocrController = async (request: Request, response: Response) => {
	try {
		const validateRequest = webhookSchema.safeParse(request.body);
		if (validateRequest.error) {
			return response.status(400).json({ error: "Bad request" });
		}
		// Classify the text of scanned text
		let classify = "adds";

		if (classify === "ad") {
		}
	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: "Internal server error" });
	}
};
