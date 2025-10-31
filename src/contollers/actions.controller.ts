import type { Request, Response } from "express";
import { runActionSchema } from "../schema/action.ts";

export const runActionController = async (
	request: Request,
	response: Response
) => {
	try {
		const validateRequest = runActionSchema.safeParse(request.body);

		if (validateRequest.error) {
			return response.status(400).json({ error: "Bad request!" });
		}

		// agent action simulation left to do;
		// deduct credit and create a usage

		return response.status(200).json({ message: "file has been created!" });
	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: "Internal server error" });
	}
};

export const getCreditUsages = async (request: Request, response: Response) => {
	try {
		return response.status(200).json({ data: [] });
	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: "Internal server error" });
	}
};
