// search on dashboard;
import { Types } from "mongoose";
import { DocumentModel } from "../models/document.model.ts";

export const searchOnDashboard = async (query: string, userId: string) => {
	try {
		const documentResources = await DocumentModel.find({
			$or: [
				{ _id: new Types.ObjectId(query) },
				{ description: { $regex: query, $options: "i" } },
				{ tags: { $regex: query, $options: "i" } },
			],
		});
	} catch (error) {
		throw error;
	}
};
