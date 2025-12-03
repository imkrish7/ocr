import { Schema, model } from "mongoose";

export const documentEmbeddingSchema = new Schema(
	{
		userId: Schema.ObjectId,
		documentId: Schema.ObjectId,
		embedding: {
			type: [Number],
			required: true,
		},
		pageContent: {
			type: String,
			required: true,
			trim: true,
			default: "",
		},
	},
	{ timestamps: true },
);

export const DocumentEmbeddingModel = model(
	"DocumentEmbedding",
	documentEmbeddingSchema,
);
