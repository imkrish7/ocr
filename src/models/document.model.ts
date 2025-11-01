import { Schema, Types, model } from "mongoose";

const documentSchema = new Schema(
	{
		ownerId: Types.ObjectId,
		filename: String,
		mime: String,
		textContent: String,
		folderId: {
			type: Types.ObjectId,
			default: null,
		},
		metadata: Schema.Types.Mixed,
	},
	{ timestamps: true }
);

const DocumentModel = model("Document", documentSchema);

export { DocumentModel };
