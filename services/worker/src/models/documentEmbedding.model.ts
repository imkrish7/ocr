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
  definition: [
    {
      type: "vector",
      path: "embedding",
      dimensions: 768,
      similarity: "dotProduct",
      quantization: "scalar",
    },
  ],
});

const DocumentEmbeddingModel = model(
  "DocumentEmbedding",
  documentEmbeddingSchema,
);

await DocumentEmbeddingModel.createSearchIndexes();

export { DocumentEmbeddingModel };
