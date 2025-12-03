import { Schema, Types, model } from "mongoose";

export const documentSchema = new Schema(
	{
		ownerId: Schema.ObjectId,
		createdBy: Schema.ObjectId,
		filename: String,
		mime: String,
		textContent: {
			type: String,
			required: false,
			default: null,
		},
		folderId: {
			type: Schema.ObjectId,
			default: null,
		},
		sourceFile: {
			status: {
				type: String,
				enum: ["PENDING", "UPLOADED", "FAILED"],
				default: "PENDING",
			},
			url: {
				type: String,
				required: false,
			},
			path: {
				type: String,
				required: true,
			},
		},
		favorite: Boolean,
		metadata: Schema.Types.Mixed,
	},
	{ timestamps: true },
);

const DocumentModel = model("Document", documentSchema);

export { DocumentModel };
