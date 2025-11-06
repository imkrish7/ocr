import type { Request, Response } from "express";
import { documentSchema } from "../schema/document.ts";
import { DocumentModel } from "../models/document.model.ts";
import { FolderModel } from "../models/folder.model.ts";
import { TagModel } from "../models/tag.model.ts";
import { DocumentTagModel } from "../models/documentTag.model.ts";
import type { IDocument } from "../types/document.ts";
import { auditActivity } from "../services/auditLogService.ts";
import { Types } from "mongoose";
import { AccessControlModel } from "../models/accessControl.model.ts";

export const createDocumentController = async (
	request: Request,
	response: Response
) => {
	try {
		const validateRequest = documentSchema.safeParse(request.body);
		const user = request.user;
		if (validateRequest.error) {
			return response.status(400).json({ error: "Bad request!" });
		}
		let folderExist;
		if (validateRequest.data.folderId) {
			folderExist = await FolderModel.findById(
				validateRequest.data.folderId
			);
		}

		if (validateRequest.data.folderId && !folderExist) {
			return response
				.status(404)
				.json({ error: "Folder does not exist!" });
		}
		if (user?.role === "user" && !folderExist) {
			return response.status(403).json({
				error: "Permission denied!",
				message:
					"You are not allowed to create document in root folder",
			});
		} else if (user?.role === "user" && folderExist) {
			const hasPermission = await AccessControlModel.findOne({
				userId: user.sub,
				resourceId: folderExist._id,
			});

			if (!hasPermission) {
				return response
					.status(403)
					.json({ error: "Permission denied!" });
			}
		}

		const checkFileExistInFolder = await DocumentModel.findOne({
			folderId: validateRequest.data.folderId,
			filename: validateRequest.data.filename,
			mime: validateRequest.data.mime,
		});

		if (checkFileExistInFolder) {
			return response.status(409).json({
				error: "Document already exist!",
				message: `File with ${validateRequest.data.filename} of ${
					validateRequest.data.mime
				} is already exist in ${
					validateRequest.data.folderId ? "folder" : "root folder"
				}`,
			});
		}

		const checkPrimaryTag = await TagModel.findById(
			validateRequest.data.primaryTag
		);

		if (!checkPrimaryTag) {
			return response
				.status(404)
				.json({ error: "Primary tag does not exist" });
		}

		const newDocument = new DocumentModel({
			filename: validateRequest.data.filename,
			mime: validateRequest.data.mime,
			textContent: validateRequest.data.textContent,
			folderId: validateRequest.data.folderId,
			ownerId: folderExist?.ownerId,
		});
		// create new document in collection
		await newDocument.save();

		// create a primary tag
		const primaryTag = new DocumentTagModel({
			documentId: newDocument._id.toString(),
			tagId: checkPrimaryTag._id.toString(),
			isPrimary: true,
		});

		await primaryTag.save();

		if (
			validateRequest.data.secondaryTags &&
			validateRequest.data.secondaryTags?.length > 0
		) {
			const secondaryTagsDocs = validateRequest.data.secondaryTags.map(
				(st) => {
					return {
						documentId: newDocument._id.toString(),
						tagId: st,
						isPrimary: false,
					};
				}
			);
			await DocumentTagModel.insertMany(secondaryTagsDocs);
		}

		await auditActivity({
			userId: new Types.ObjectId(request.user?.sub),
			entityId: newDocument._id.toString(),
			entityType: "document",
			action: ["document created"],
			metadata: newDocument.metadata,
			parentId: folderExist!.ownerId,
		});

		return response.status(201).json({ data: newDocument });
	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: "Internal server error!" });
	}
};

export const getFoldersController = async (
	request: Request,
	response: Response
) => {
	try {
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

export const getDocumentWithTagController = async (
	request: Request,
	response: Response
) => {
	try {
		const { tag } = request.params;
		if (!tag) {
			return response.status(400).json({ error: "Bad request" });
		}

		const isTagExist = await TagModel.findOne({ name: tag });
		if (!isTagExist) {
			return response.status(404).json({ error: "Tag does not exist!" });
		}

		const documentWithTags = await DocumentTagModel.aggregate([
			{
				$match: {
					tagId: isTagExist._id.toString(),
					isPrimary: true,
				},
			},
			{
				$lookup: {
					from: "documents",
					localField: "documentId",
					foreignField: "_id",
					as: "documentsWithTag",
				},
			},
		]);
		return response.status(200).json({ data: documentWithTags });
	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: "Internal server error!" });
	}
};

export const getDocumentWithFilters = async (
	request: Request,
	response: Response
) => {
	try {
		const { q } = request.query;
		let documents: IDocument[];
		if (Array.isArray(q)) {
			documents = await DocumentModel.find({
				_id: {
					$in: q,
				},
			});
		} else if (q instanceof String && q.length > 0) {
			documents = await DocumentModel.find({
				folderId: q,
			});
		} else {
			documents = [];
		}

		return response.status(200).json({ data: documents });
	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: "Internal server error!" });
	}
};
