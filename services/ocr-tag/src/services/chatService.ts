import { z } from "zod";
import { DocumentEmbeddingModel } from "../models/documentEmbedding.model.ts";
import { getQueryEmbedding } from "./embedService.ts";
import { ChatOllama } from "@langchain/ollama";
import { type BaseMessage } from "@langchain/core/messages";
import { MessagesZodMeta, StateGraph } from "@langchain/langgraph";
import { registry } from "@langchain/langgraph/zod";

const llm = new ChatOllama({
	model: "llama2",
});

const graphState = z.object({
	docid: z.string(),
	query: z.string(),
	context: z.array(z.string()),
	messages: z.array(z.custom<BaseMessage>()).register(registry, {
		reducer: { fn: (x, y) => x.concat(y) },
	}),
});

const retrieval = async (state: z.infer<typeof graphState>) => {
	const { docid, query } = state;
	const queryEmbedding = await getQueryEmbedding(query);
	const documentContents = await DocumentEmbeddingModel.aggregate([
		{ $match: { docid: docid } },
		{
			$vectorSearch: {
				index: "documentEmbeddingsIndex",
				queryVector: queryEmbedding,
				exact: true,
				path: "embedding",
				limit: 10,
			},
		},
	]);
	const context = documentContents.map((d) => d.pageContent);
	return { ...state, context };
};

const summarizeContext = async (state: z.infer<typeof graphState>) => {
	const { context } = state;
	const message = await llm.invoke([
		{ role: "system", content: "You are a helpfull assistant" },
		{ role: "assistant", content: `context: ${context.join("\n")}` },
		{ role: "user", content: `Question: ${state.query}` },
		{
			role: "assistant",
			content:
				"If question is not relvant to context, please provide a helpfull questions otherwize answer from the context",
		},
	]);
	return {
		...state,
		messages: [message],
	};
};

const chatWorkflow = new StateGraph(graphState)
	.addNode("retrieval", retrieval)
	.addNode("summarizeContext", summarizeContext)
	.addEdge("__start__", "retrieval")
	.addEdge("retrieval", "summarizeContext")
	.addEdge("summarizeContext", "__end__")
	.compile();

const chat = async (docid: string, query: string) => {
	const events = chatWorkflow.streamEvents(
		{
			docid,
			query,
			context: [],
			messages: [],
		},
		{
			version: "v2",
			streamMode: "messages",
		},
	);
};
