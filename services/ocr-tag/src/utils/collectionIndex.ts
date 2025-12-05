import { DocumentModel, documentSchema } from "../models/document.model.ts";
import {
	DocumentEmbeddingModel,
	documentEmbeddingSchema,
} from "../models/documentEmbedding.model.ts";

export const collectionIndex = [
	{
		collection: DocumentModel,
		Schema: documentSchema,
	},
	{
		collection: DocumentEmbeddingModel,
		Schema: documentEmbeddingSchema,
	},
];
