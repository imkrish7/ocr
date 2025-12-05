import type { Request, Response } from "express";
import { documentSearch, folderSearch } from "../services/searchService.ts";

export const searchController = async (
	request: Request,
	response: Response,
) => {
	const { query } = request.query;
	const userId = request.user?.sub;

	try {
		if (!query) {
			return response
				.status(400)
				.json({ error: "Missing query parameter" });
		}
		if (!userId) {
			return response.status(401).json({ error: "Unauthorized" });
		}

		const documentResources = await documentSearch(
			query.toString(),
			userId,
		);

		const folderResources = await folderSearch(query.toString(), userId);
		return response.status(200).json({
			documents: documentResources,
			folders: folderResources,
		});
	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: "Internal Server Error" });
	}
};
