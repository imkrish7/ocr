// search on dashboard;
import { Types } from "mongoose";
import { DocumentModel } from "../models/document.model.ts";
import { getQueryEmbedding } from "./embedService.ts";
import { FolderModel } from "../models/folder.model.ts";

export const documentSearch = async (query: string, userId: string) => {
	try {
		const queryEmbedding = await getQueryEmbedding(query);
		const documentResources = await DocumentModel.find({
			$or: [
				{ _id: new Types.ObjectId(query) },
				{ ownerId: new Types.ObjectId(query) },
				{ createdBy: new Types.ObjectId(query) },
			],
		});

		const documentSearchOnRelevance = await DocumentModel.aggregate([
			{
				$match: {
					$or: [
						{ ownerId: new Types.ObjectId(query) },
						{ createdBy: new Types.ObjectId(query) },
					],
				},
			},
			{
				$vectorSearch: {
					index: "documentsVectorIndex",
					queryVector: queryEmbedding,
					path: "summary.embedding",
					exact: true,
					limit: 10,
				},
			},
		]);

		return [...documentResources, ...documentSearchOnRelevance];
	} catch (error) {
		throw error;
	}
};

export const folderSearch = async (query: string, userId: string) => {
	try {
		const folders = await FolderModel.aggregate([
			{
				$match: {
					$or: [
						{ userId: new Types.ObjectId(userId) },
						{ ownerId: new Types.ObjectId(userId) },
					],
				},
			},
			{
				$match: {
					$or: [
						{ _id: new Types.ObjectId(query) },
						{ ownerId: new Types.ObjectId(query) },
						{ createdBy: new Types.ObjectId(query) },
						{ alias: { $regex: query, $options: "i" } },
						{ description: { $regex: query, $options: "i" } },
					],
				},
			},
		]);

		return folders;
	} catch (error) {
		throw error;
	}
};
