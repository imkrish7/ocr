import type { Request, Response } from "express";

export const runActionController = async (
	request: Request,
	response: Response
) => {
	try {
	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: "Internal server error" });
	}
};
