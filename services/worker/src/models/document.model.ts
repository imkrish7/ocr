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

// documentSchema.searchIndex({
//   name: "documentsVectorIndex",
//   type: "vectorSearch",
//   definition: [
//     {
//       type: "vector",
//       path: "summary.embedding",
//       dimensions: 768,
//       similarity: "dotProduct",
//       quantization: "scalar",
//     },
//   ],
// });

const DocumentModel = model("Document", documentSchema);

// await DocumentModel.createSearchIndexes();

export { DocumentModel };
