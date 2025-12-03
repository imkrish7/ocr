import { Schema, model } from "mongoose";

const roleSchema = new Schema(
	{
		name: {
			type: String,
			enum: ["admin", "moderator", "support", "user"],
			required: true,
		},
		description: String,
		permissions: [
			{
				resource: {
					type: String,
					enum: ["folder", "document"],
					required: true,
				},
				actions: [
					{
						type: [String],
						enum: ["read", "write", "delete", "update"],
						required: true,
					},
				],
			},
		],
	},
	{ timestamps: true }
);

const RoleModel = model("Role", roleSchema);

export { RoleModel };
