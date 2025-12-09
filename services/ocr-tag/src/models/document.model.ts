import { NumberedListOutputParser } from "@langchain/core/output_parsers";
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
		summary: {
			content: String,
			embedding: [Number],
		},
	},
	{
		timestamps: true,
	},
);

documentSchema.index({ ownerId: 1, folderId: 1, createdBy: 1 });

documentSchema.searchIndex({
	name: "documentsVectorIndex",
	type: "vectorSearch",
	definition: {
		fields: [
			{
				type: "vector",
				path: "summary.embedding",
				numDimensions: 768,
				similarity: "dotProduct",
				quantization: "scalar",
			},
		],
	},
});

const DocumentModel = model("Document", documentSchema);

DocumentModel.createIndexes().then(() => {
	console.log("Document indexes created");
});

DocumentModel.createSearchIndexes().then(() => {
	console.log("Document search index created");
});

export { DocumentModel };
