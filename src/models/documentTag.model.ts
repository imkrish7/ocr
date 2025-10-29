import { Schema, model } from "mongoose";

const documentTagSchema = new Schema(
	{
		documentId: String,
		tagId: String,
		isPrimary: Boolean,
		createtAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

const DocumentTagModel = model("DocumentTag", documentTagSchema);

export { DocumentTagModel };
