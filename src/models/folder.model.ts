import { Schema, model } from "mongoose";

const folderSchema = new Schema(
	{
		name: String,
		parentId: String,
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

const FolderModel = model("Folder", folderSchema);

export { FolderModel };
