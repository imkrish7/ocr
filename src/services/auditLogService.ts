import type { Schema, Types } from "mongoose";
import { AuditLogModel } from "../models/audit.model.ts";

interface AuditEnity {
	userId: Types.ObjectId;
	entityId: string;
	entityType: string;
	metadata?: Schema.Types.Mixed;
	action: string[];
}

export async function auditActivity(auditLog: AuditEnity) {
	try {
		const newActivity = await AuditLogModel.create({
			...auditActivity,
		});

		await newActivity.save();
	} catch (error) {
		throw error;
	}
}
