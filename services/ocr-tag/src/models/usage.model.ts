import { Schema, Types, model } from "mongoose";

const usageSchema = new Schema(
	{
		credits: Number,
		actions: [String],
		userId: Schema.ObjectId,
		parentId: Schema.ObjectId,
		scope: {
			type: {
				type: String,
			},
			name: {
				type: String,
			},
		},
		objectId: Schema.ObjectId,
	},
	{ timestamps: true }
);

const UsageModel = model("Usage", usageSchema);

export { UsageModel };
