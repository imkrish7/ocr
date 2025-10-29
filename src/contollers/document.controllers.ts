import type { Request, Response } from "express";
import { documentSchema } from "../schema/document.ts";
import { DocumentModel } from "../models/document.model.ts";
import { FolderModel } from "../models/folder.model.ts";
import { TagModel } from "../models/tag.model.ts";
import { DocumentTagModel } from "../models/documentTag.model.ts";

export const createDocumentController = async (
	request: Request,
	response: Response
) => {
	try {
		const validateRequest = documentSchema.safeParse(request.body);
		if (validateRequest.error) {
			return response.status(400).json({ error: "Bad request!" });
		}
		let folderExist;
		if (validateRequest.data.folderId) {
			folderExist = await FolderModel.findById(
				validateRequest.data.folderId
			);
			if (!folderExist) {
				return response
					.status(404)
					.json({ error: "Folder does not exist!" });
			}
		}

		const checkFileExistInFolder = await DocumentModel.findOne({
			folderId: validateRequest.data.folderId,
			filename: validateRequest.data.filename,
			mime: validateRequest.data.mime,
		});

		if (checkFileExistInFolder) {
			return response.status(409).json({
				error: `File with ${validateRequest.data.filename} of ${
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
	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: "Internal server error" });
	}
};
