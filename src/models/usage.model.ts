import { Schema, Types, model } from "mongoose";

const usageSchema = new Schema(
	{
		credits: Number,
		actions: [String],
		userId: Types.ObjectId,
		scope: {
			type: {
				type: String,
			},
			name: {
				type: String,
			},
		},
		objectId: Types.ObjectId,
	},
	{ timestamps: true }
);

const UsageModel = model("Usage", usageSchema);

export { UsageModel };
