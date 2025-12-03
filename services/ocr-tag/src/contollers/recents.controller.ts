import type { Request, Response } from "express";
import { AuditLogModel } from "../models/audit.model.ts";
import { Types } from "mongoose";

export const getRecentResourcesController = async (
	request: Request,
	response: Response
) => {
	try {
		// Based on recent activity find documents and resources
		const user = request.user;

		const fetchFolderResources = await AuditLogModel.aggregate([
			{
				$match: {
					entityType: "folder",
					userId: new Types.ObjectId(user?.sub),
				},
			},
			{
				$lookup: {
					from: "folders",
					localField: "entityId",
					foreignField: "_id",
					as: "recentFolders",
				},
			},
		]);
		const folders = fetchFolderResources.reduce((acc, entity) => {
			return [...acc, ...entity["recentFolders"]];
		}, []);
		const fetchDocumentResources = await AuditLogModel.aggregate([
			{
				$match: {
					entityType: "document",
					userId: new Types.ObjectId(user?.sub),
				},
			},
			{
				$lookup: {
					from: "documents",
					localField: "entityId",
					foreignField: "_id",
					as: "recentDocuments",
				},
			},
		]);

		const documents = fetchDocumentResources.reduce((acc, entity) => {
			return [...acc, ...entity["recentDocuments"]];
		}, []);

		return response.status(200).json({
			data: {
				folders: folders,
				documents: documents,
			},
		});
	} catch (error) {
		console.error(error);
		return response.status(500).json();
	}
};
