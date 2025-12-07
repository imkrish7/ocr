import { z } from "zod";
import { StateGraph } from "@langchain/langgraph";
import { DocumentEmbeddingModel } from "../models/documentEmbedding.model.ts";
import { ChatOllama } from "@langchain/ollama";
import { Types } from "mongoose";

const llm = new ChatOllama({
  model: "llama3.2",
});

const SummaryState = z.object({
  docid: z.string(),
  chunkTexts: z.array(z.string()),
  chunkSummeries: z.array(z.string()),
  finalSummary: z.string(),
});

export const retriever = async (state: z.infer<typeof SummaryState>) => {
  const documents = await DocumentEmbeddingModel.find({
    documentId: new Types.ObjectId(state.docid),
  });

  const chunks = documents.map((doc) => doc.pageContent);

  return {
    ...state,
    chunkTexts: chunks,
  };
};

const chunkSummerizer = async (state: z.infer<typeof SummaryState>) => {
  const chunkSummeries = [];
  for (const chunk of state.chunkTexts) {
    const summary = await llm.invoke(
      `summarize this text in 4-5 bullet points:\n\n ${chunk}`,
    );
    chunkSummeries.push(summary.content);
  }

  return {
    ...state,
    chunkSummeries,
  };
};

const summary = async (state: z.infer<typeof SummaryState>) => {
  const chunkSummaries = state.chunkSummeries.join("\n\n");

  const finalSummary = await llm.invoke(
    `Combine all these chunkSummaries into a single summary, coherent, concise and informative: \n\n ${chunkSummaries}`,
  );

  return {
    ...state,
    finalSummary: finalSummary.content,
  };
};

const summerizerWorkflow = new StateGraph(SummaryState)
  .addNode("retriever", retriever)
  .addNode("chunkSummaries", chunkSummerizer)
  .addNode("summary", summary)
  .addEdge("__start__", "retriever")
  .addEdge("retriever", "chunkSummaries")
  .addEdge("chunkSummaries", "summary")
  .addEdge("summary", "__end__")
  .compile();

export const summarizeDocument = async (docid: string) => {
  const result = await summerizerWorkflow.invoke({
    docid: docid,
    chunkSummeries: [],
    chunkTexts: [],
    finalSummary: "",
  });

  return result.finalSummary;
};
