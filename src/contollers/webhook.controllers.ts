import type { Request, Response } from "express";
import { webhookSchema } from "../schema/webhook.ts";
import { DocumentModel } from "../models/document.model.ts";
import { getMimeType } from "../utils/mimeType.ts";
import { TaskModel } from "../models/task.model.ts";
import { auditActivity } from "../services/auditLogService.ts";
import { Types } from "mongoose";
import { FolderModel } from "../models/folder.model.ts";

export const ocrController = async (request: Request, response: Response) => {
	try {
		const { folderId } = request.params;
		const user = request.user;
		const validateRequest = webhookSchema.safeParse(request.body);
		if (validateRequest.error) {
			return response.status(400).json({ error: "Bad request" });
		}
		let folderExist;
		if (folderId) {
			folderExist = await FolderModel.findById(folderId);
		} else {
			return response.status(404).json({ error: "Folder is invalid" });
		}

		if (!folderExist) {
			return response
				.status(404)
				.json({ error: "Folder does not exist" });
		}
		// Classify the text of scanned text
		let classify = "ad";

		if (classify === "official") {
			const mimeType = getMimeType(validateRequest.data.imageId);
			const newDocument = await DocumentModel.create({
				filename: validateRequest.data.imageId,
				textContent: validateRequest.data.text,
				mime: mimeType,
				folderId: null,
				ownerId: request.user?.sub,
				meta: {
					source: validateRequest.data.source,
					...validateRequest.data.meta,
				},
			});

			await newDocument.save();
			await auditActivity({
				userId: new Types.ObjectId(request.user?.sub),
				entityId: newDocument._id.toString(),
				entityType: "document",
				action: ["Document created"],
				parentId: folderExist.ownerId,
			});
			return response.status(201).json({
				message: "New document created in root folder",
				type: "document",
			});
		}

		if (classify === "ad") {
			const currentDate = new Date();
			const currentTime = currentDate.getTime();
			const startOfDay = new Date(
				currentDate.getFullYear(),
				currentDate.getMonth(),
				currentDate.getDate(),
				0,
				0,
				0,
				0
			);
			const taskCreatedToday = await TaskModel.find({
				userId: request.user?.sub,
				createdAt: {
					$and: [{ $lt: currentTime }, { $gt: startOfDay }],
				},
			});
			if (taskCreatedToday.length > 3) {
				return response.status(400).json({
					error: "Daily limit to create task has been over!",
				});
			}
			const extractChannel = "mail@example.com"; //validateRequest.data.text
			const newTask = await TaskModel.create({
				status: "pending",
				channel: "email",
				target: extractChannel,
				userId: request.user?.sub,
			});
			await newTask.save();
			await auditActivity({
				userId: new Types.ObjectId(request.user?.sub),
				entityId: newTask._id.toString(),
				entityType: "task",
				action: ["task created"],
				parentId: folderExist.ownerId,
			});
			return response
				.status(201)
				.json({ message: "New task has been created!" });
		}

		return response.status(400).json({ error: "Invalid request!" });
	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: "Internal server error" });
	}
};
