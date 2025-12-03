import { DocumentModel, documentSchema } from "../models/document.model.ts";
import {
	DocumentEmbeddingModel,
	documentEmbeddingSchema,
} from "../models/documentEmbedding.model.ts";

export const collectionIndex = [
	{
		collection: DocumentModel,
		Schema: documentSchema,
		name: "documents",
		type: "vectorSearch",
		fields: [
			{
				type: "vector",
				path: "summary.embedding",
				dimensions: 768,
				similarity: "dotProduct",
				quantization: "scalar",
			},
		],
	},
	{
		collection: DocumentEmbeddingModel,
		Schema: documentEmbeddingSchema,
		name: "documentembeddings",
		type: "vectorSearch",
		fields: [
			{
				type: "vector",
				path: "embedding",
				dimensions: 768,
				similarity: "dotProduct",
				quantization: "scalar",
			},
		],
	},
];
