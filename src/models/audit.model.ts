import { Schema, Types, model } from "mongoose";

const auditLogSchema = new Schema(
	{
		userId: Types.ObjectId,
		action: String,
		entityId: Types.ObjectId,
		entityType: String,
		metaData: Schema.Types.Mixed,
	},
	{
		timestamps: true,
	}
);

const AuditLogModel = model("AuditLog", auditLogSchema);

export { AuditLogModel };
