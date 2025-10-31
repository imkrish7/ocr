import { Schema, model } from "mongoose";

const tagSchema = new Schema(
	{
		name: String,
		ownerId: String,
	},
	{ timestamps: true }
);

const TagModel = model("Tag", tagSchema);

export { TagModel };
