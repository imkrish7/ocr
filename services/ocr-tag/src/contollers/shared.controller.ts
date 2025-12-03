import type { Request, Response } from "express";
import { RoleModel } from "../models/role.model.ts";
import { AccessControlModel } from "../models/accessControl.model.ts";

export const getSharedResourcesController = async (
	request: Request,
	response: Response
) => {
	try {
		const user = request.user;

		const fetchAdminRole = await RoleModel.findOne({
			name: "admin",
		});

		const fetchFolderResources = await AccessControlModel.aggregate([
			{
				$match: {
					userId: user?.sub,
					roleId: { $ne: fetchAdminRole?._id },
					resourceType: "folder",
				},
			},
			{
				$lookup: {
					from: "folders",
					localField: "resourceId",
					foreignField: "_id",
					as: "shared_folder",
				},
			},
		]);

		const fetchDocumentResources = await AccessControlModel.aggregate([
			{
				$match: {
					roleId: { $ne: fetchAdminRole?._id },
					resourceType: "document",
				},
			},
			{
				$lookup: {
					from: "documents",
					localField: "resourceId",
					foreignField: "_id",
					as: "shared_documents",
				},
			},
		]);

		return response.status(200).json({
			data: {
				folders: fetchFolderResources,
				documents: fetchDocumentResources,
			},
		});
	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: "Internal server error!" });
	}
};
