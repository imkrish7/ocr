import { Schema, model } from "mongoose";

const tagSchema = new Schema(
	{
		name: String,
		ownerId: String,
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

const TagModel = model("Tag", tagSchema);

export { TagModel };
