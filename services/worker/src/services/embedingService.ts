import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OllamaEmbeddings } from "@langchain/ollama";
import { getDocument } from "../core/minio.ts";
import path from "path";
import { fileURLToPath } from "url";
import { DocumentModel } from "../models/document.model.ts";
import { DocumentEmbeddingModel } from "../models/documentEmbedding.model.ts";
import { summarizeDocument } from "./summerizerService.ts";

const loadDocuments = async (url: string) => {
  try {
    const documents = new PDFLoader(url);
    return documents.load();
  } catch (error) {
    throw error;
  }
};

const embedContent = async (content: string) => {
  try {
    const embedder = new OllamaEmbeddings({
      model: "embeddinggemma",
    });

    const embedding = await embedder.embedDocuments([content]);
    return embedding;
  } catch (error) {
    throw error;
  }
};

export const RFPProcessing = async (data: {
  docid: string;
  userId: string;
  folderId: string;
}) => {
  try {
    const attachments = await DocumentModel.findOne({
      _id: data.docid,
      userId: data.userId,
      parentId: data.folderId,
    });
    if (attachments) {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const fileDirs = path.join(__dirname, "document");
      const filePath = path.join(fileDirs, `current.pdf`);

      const _documents = await getDocument(
        attachments.sourceFile?.path || "",
        "ocr",
        filePath,
      );

      const document = await loadDocuments(filePath);

      const textsplitters = new RecursiveCharacterTextSplitter({
        separators: ["\n\n"],
        chunkOverlap: 10,
        chunkSize: 200,
      });

      if (document) {
        const documents = await textsplitters.splitDocuments(document);
        for (let doc of documents) {
          const embedding = await embedContent(doc.pageContent);
          const newDocumentEmbedding = new DocumentEmbeddingModel({
            documentId: data.docid,
            embedding: embedding[0],
            userId: data.userId,
            content: doc.pageContent,
          });
          await newDocumentEmbedding.save();
        }
        const result = await summarizeDocument(data.docid);
        const embedding = await embedContent(result);
        await DocumentModel.findByIdAndUpdate(data.docid, {
          summary: {
            content: result,
            embedding: embedding[0],
          },
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
};
