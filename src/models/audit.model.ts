import { Schema, Types, model } from "mongoose";

const auditLogSchema = new Schema(
	{
		userId: {
			type: Types.ObjectId,
			required: true,
		},
		parentId: {
			type: Types.ObjectId,
			required: true,
		},
		action: [String],
		entityId: Types.ObjectId,
		entityType: String,
		metaData: {
			type: Schema.Types.Mixed,
			required: false,
		},
	},
	{
		timestamps: true,
	}
);

const AuditLogModel = model("AuditLog", auditLogSchema);

export { AuditLogModel };
