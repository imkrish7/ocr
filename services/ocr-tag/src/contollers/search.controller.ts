import type { Request, Response } from "express";

export const searchController = async (
	request: Request,
	response: Response,
) => {
	const { query, where } = request.query;

	try {
		switch (where) {
			case "dashboard":
				break;
			case "favorite":
				break;
			case "recent":
				break;
			case "shared":
				break;
			default:
				break;
		}
	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: "Internal Server Error" });
	}
};
