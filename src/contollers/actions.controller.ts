import type { Request, Response } from "express";
import { runActionSchema } from "../schema/action.ts";
import { FolderModel } from "../models/folder.model.ts";
import { DocumentModel } from "../models/document.model.ts";
import { UsageModel } from "../models/usage.model.ts";
import { auditActivity } from "../services/auditLogService.ts";
import { Types } from "mongoose";

export const runActionController = async (
	request: Request,
	response: Response
) => {
	try {
		const validateRequest = runActionSchema.safeParse(request.body);

		if (validateRequest.error) {
			return response.status(400).json({ error: "Bad request!" });
		}
		const validateData = validateRequest.data;
		let resource;
		if (validateData.scope.type == "folder") {
			resource = await FolderModel.findOne({
				name: validateData.scope.name,
				ownerId: request.user?.sub,
			});
		} else if (validateData.scope.type == "document") {
			resource = await DocumentModel.findOne({
				filename: validateData.scope.name,
				ownerId: request.user?.sub,
			});
		} else {
			return response.status(404).json({ error: "Invalid scope" });
		}

		if (!resource) {
			return response.status(404).json({ error: "Invalid resource" });
		}
		// agent action simulation left to do;
		// deduct credit and create a usage

		const actionUsageCredit = await UsageModel.create({
			credits: 5,
			actions: [...validateData.actions],
			userId: request.user?.sub,
			scope: validateData.scope,
		});

		await actionUsageCredit.save();

		await auditActivity({
			userId: new Types.ObjectId(request.user?.sub),
			entityId: resource._id.toString(),
			entityType: validateData.scope.name,
			action: [...validateData.actions],
			metadata: resource.metadata ?? {},
		});

		return response.status(200).json({ message: "file has been created!" });
	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: "Internal server error" });
	}
};

export const getCreditUsagesController = async (
	request: Request,
	response: Response
) => {
	try {
		const user = request.user;

		const totalCredit = await UsageModel.aggregate([
			{
				$match: {
					userId: user?.sub,
				},
			},
			{
				$group: {
					_id: { userId: 1 },
					credits: { $sum: "$credits" },
				},
			},
		]);
		return response.status(200).json({ data: totalCredit });
	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: "Internal server error" });
	}
};
