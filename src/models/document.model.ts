import { Schema, Types, model } from "mongoose";

const documentSchema = new Schema(
	{
		ownerId: Schema.ObjectId,
		createdBy: Schema.ObjectId,
		filename: String,
		mime: String,
		textContent: String,
		folderId: {
			type: Schema.ObjectId,
			default: null,
		},
		metadata: Schema.Types.Mixed,
	},
	{ timestamps: true }
);

const DocumentModel = model("Document", documentSchema);

export { DocumentModel };
