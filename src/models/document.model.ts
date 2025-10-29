import { Schema, model } from "mongoose";

const documentSchema = new Schema(
	{
		ownerId: String,
		filename: String,
		mime: String,
		textContent: String,
		createdAt: {
			type: Date,
			default: Date.now(),
		},
	},
	{ timestamps: true }
);

const DocumentModel = model("Document", documentSchema);

export { DocumentModel };
