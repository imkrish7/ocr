import { Schema, model } from "mongoose";

const folderSchema = new Schema(
	{
		name: String,
		parentId: String,
	},
	{ timestamps: true }
);

const FolderModel = model("Folder", folderSchema);

export { FolderModel };
