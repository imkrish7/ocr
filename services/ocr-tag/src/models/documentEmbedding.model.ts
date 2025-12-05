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

documentEmbeddingSchema.searchIndex({
	name: "documentEmbeddingsIndex",
	type: "vectorSearch",
	definition: {
		fields: [
			{
				type: "vector",
				path: "embedding",
				numDimensions: 768,
				similarity: "dotProduct",
				quantization: "scalar",
			},
		],
	},
});

const DocumentEmbeddingModel = model(
	"DocumentEmbedding",
	documentEmbeddingSchema,
);

DocumentEmbeddingModel.createSearchIndexes().then(() => {
	console.log("Document embedding search index created");
});

export { DocumentEmbeddingModel };
