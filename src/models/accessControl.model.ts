import { Schema, Types, model } from "mongoose";

const accessControlSchema = new Schema(
	{
		userId: { type: Types.ObjectId, required: true },
		roleId: { type: Types.ObjectId, required: true },
		resourceType: {
			type: String,
			enum: ["folder", "document"],
			required: true,
		},
		resourceId: { type: Types.ObjectId, required: true },
		inherited: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

const AccessControlModel = model("AccessControl", accessControlSchema);

export { AccessControlModel };
