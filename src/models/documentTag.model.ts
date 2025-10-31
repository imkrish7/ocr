import { Schema, model } from "mongoose";

const documentTagSchema = new Schema(
	{
		documentId: String,
		tagId: String,
		isPrimary: Boolean,
	},
	{ timestamps: true }
);

const DocumentTagModel = model("DocumentTag", documentTagSchema);

export { DocumentTagModel };
