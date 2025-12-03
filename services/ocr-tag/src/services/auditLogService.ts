import type { Schema, Types } from "mongoose";
import { AuditLogModel } from "../models/audit.model.ts";

interface AuditEntity {
	userId: Types.ObjectId;
	entityId: string;
	entityType: string;
	metadata?: Schema.Types.Mixed;
	action: string[];
	parentId: Types.ObjectId;
}

export async function auditActivity(auditLog: AuditEntity) {
	try {
		const newActivity = await AuditLogModel.create({
			...auditLog,
		});

		await newActivity.save();
	} catch (error) {
		throw error;
	}
}
