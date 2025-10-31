import { Schema, Types, model } from "mongoose";

const folderSchema = new Schema(
	{
		name: String,
		parentId: String,
		ownerId: Types.ObjectId,
	},
	{ timestamps: true }
);

const FolderModel = model("Folder", folderSchema);

export { FolderModel };
