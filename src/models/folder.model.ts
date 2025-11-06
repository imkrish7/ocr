import { Schema, Types, model } from "mongoose";

const folderSchema = new Schema(
	{
		name: String,
		parentId: String,
		createdBy: Schema.ObjectId,
		ownerId: {
			type: Schema.ObjectId,
			required: true,
		},
		metadata: Schema.Types.Mixed,
	},
	{ timestamps: true }
);

const FolderModel = model("Folder", folderSchema);

export { FolderModel };
