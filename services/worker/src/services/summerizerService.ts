import { z } from "zod";
import { StateGraph } from "@langchain/langgraph";
import { DocumentEmbeddingModel } from "../models/documentEmbedding.model.ts";
import { ChatOllama } from "@langchain/ollama";

const llm = new ChatOllama({
  model: "llama2",
});

const SummaryState = z.object({
  docid: z.string(),
  chunkTexts: z.array(z.string()),
  chunkSummeries: z.array(z.string()),
  finalSummary: z.string(),
});

export const retriever = async (state: z.infer<typeof SummaryState>) => {
  const documents = await DocumentEmbeddingModel.find({
    documentId: state.docid,
  });

  const chunks = documents.map((doc) => doc.pageContent);

  return {
    ...state,
    chunkTexts: chunks,
  };
};

const chunkSummerizer = async (state: z.infer<typeof SummaryState>) => {
  const chunkSummeries = [];

  for (const chunk in state.chunkTexts) {
    const summary = await llm.invoke(
      `summarize this text in 4-5 bullet points:\n\n ${chunk}`,
    );
    chunkSummeries.push(summary);
  }

  return {
    ...state,
    chunkSummeries,
  };
};

const finalSummary = async (state: z.infer<typeof SummaryState>) => {
  const chunkSummaries = state.chunkSummeries.join("\n\n");

  const finalSummary = await llm.invoke(
    `Combine all these chunkSummaries into a single summary, coherent, concise and informative: \n\n ${chunkSummaries}`,
  );

  return {
    ...state,
    finalSummary,
  };
};

const summerizerWorkflow = new StateGraph(SummaryState)
  .addNode("retriever", retriever)
  .addNode("chunkSummaries", chunkSummerizer)
  .addNode("finalSummary", finalSummary)
  .addEdge("__start__", "retriever")
  .addEdge("retriever", "chunkSummaries")
  .addEdge("chunkSummaries", "finalSummary")
  .addEdge("finalSummary", "__end__")
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
