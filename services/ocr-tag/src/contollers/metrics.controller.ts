import type { Request, Response } from "express";
import { AuditLogModel } from "../models/audit.model.ts";

export const metricsController = async (
	request: Request,
	response: Response
) => {
	try {
		const user = request.user;

		const activities = await AuditLogModel.aggregate([
			{
				$match: {
					userId: user?.sub,
				},
			},
			{
				$group: {
					_id: { entityType: 1 },
					total: { $sum: 1 },
				},
			},
		]);

		const activitiesStats = activities.reduce((acc, el) => {
			if (!acc[el._id]) {
				acc[el._id] = el.total;
			}
			return acc;
		}, {});

		return response.status(200).json({ data: activitiesStats });
	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: "Internal server error!" });
	}
};
