import { Schema, Types, model } from "mongoose";

const folderSchema = new Schema(
	{
		name: String,
		alias: String,
		parentId: {
			type: String,
			default: null,
		},
		createdBy: Schema.ObjectId,
		typeOf: {
			type: String,
			enum: ["root", "subfolder"],
			default: "subfolder",
		},
		ownerId: {
			type: Schema.ObjectId,
			required: true,
		},
		favorite: Boolean,
		metadata: Schema.Types.Mixed,
	},
	{ timestamps: true }
);

const FolderModel = model("Folder", folderSchema);

export { FolderModel };
