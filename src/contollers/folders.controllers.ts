import { DocumentModel } from "../models/document.model.ts";
import type { Request, Response } from "express";
import { FolderModel } from "../models/folder.model.ts";
import { createFolder } from "../schema/folder.ts";
import { AccessControlModel } from "../models/accessControl.model.ts";
import { Types } from "mongoose";

export const getFoldersController = async (
	request: Request,
	response: Response
) => {
	try {
		const user = request.user;

		if (!user) {
			return response.status(401).json({ error: "Unauthorized" });
		}

		const folders = await FolderModel.find({
			ownerId: user.sub,
		});

		return response.status(200).json({ data: folders });
	} catch (error) {
		return response.status(500).json({ error: "Internal server error" });
	}
};

export const getFoldersWithDocumentController = async (
	request: Request,
	response: Response
) => {
	try {
		const user = request.user;
		// first fetch all primary documentTags now join with document groupby folderid and primaryTag then perform count on it
		const files = await DocumentModel.aggregate([
			{
				$lookup: {
					from: "documentTags",
					localField: "_id",
					foreignField: "documentId",
					let: { isPrimary: "$isPrimary" },
					as: "documentListWithTag",
					pipeline: [
						{
							$match: {
								$expr: { $eq: ["$$isPrimary", true] },
							},
						},
					],
				},
			},
			{ $unwind: "$documentListWithTag" },
			{
				$lookup: {
					from: "folders",
					localField: "folderId",
					foreignField: "_id",
					as: "documentWithFolder",
				},
			},
			{ $unwind: "$documentWithFolder" },
			{
				$group: {
					_id: {
						folderId: "$documentWithFolder.folderId",
						folderName: "$documentWithFolder.name",
					},
					documentCount: { $sum: 1 },
				},
			},
		]);

		return response.status(200).json({ data: files });
	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: "Internal server error" });
	}
};

export const createFolderController = async (
	request: Request,
	response: Response
) => {
	try {
		const user = request.user;

		const validateRequest = createFolder.safeParse(request.body);

		if (validateRequest.error) {
			return response
				.status(400)
				.json({ error: validateRequest.error.message });
		}

		const accessControl = await AccessControlModel.findOne({
			resourceId: validateRequest.data.parentId,
			userId: user?.sub,
		});

		if (!accessControl) {
			return response.status(403).json({ error: "Permission denied!" });
		}

		const isParentExist = await FolderModel.findById(
			validateRequest.data.parentId
		);

		if (!isParentExist) {
			return response
				.status(404)
				.json({ error: "Parent folder not found!" });
		}

		const newFolder = new FolderModel({
			alias: validateRequest.data.name,
			parentId: validateRequest.data.parentId,
			typeOf: "subfolder",
			name: `Folder-${Date.now()}-${user?.sub}`,
			createdBy: new Types.ObjectId(user?.sub),
			ownerId: isParentExist?.ownerId,
		});

		await newFolder.save();
		return response.status(201).json({ message: "Folder added!" });
	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: "Internal server error!" });
	}
};
