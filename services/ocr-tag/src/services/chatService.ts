import { z } from "zod";
import { DocumentEmbeddingModel } from "../models/documentEmbedding.model.ts";
import { getQueryEmbedding } from "./embedService.ts";
import { ChatOllama } from "@langchain/ollama";
import { type BaseMessage } from "@langchain/core/messages";
import { MessagesZodMeta, StateGraph } from "@langchain/langgraph";
import { registry } from "@langchain/langgraph/zod";
import type { Response } from "express";
import {
	type StreamMessage,
	StreamMessageType,
	SSE_DATA_PREFIX,
	SSE_DONE_MESSAGE,
	SSE_LINE_DELIMITER,
} from "../types/graph.ts";

const llm = new ChatOllama({
	model: "llama3.2",
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
		{
			$vectorSearch: {
				index: "documentEmbeddingsIndex",
				queryVector: queryEmbedding,
				exact: true,
				path: "embedding",
				limit: 10,
				filter: { documentId: { $eq: docid } },
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
				"If question is not relevant to context, please provide a helpfull questions otherwise answer from the context",
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

async function sendSSEMessage(writer: Response, data: StreamMessage) {
	const encoder = new TextEncoder();

	return writer.write(
		encoder.encode(
			`${SSE_DATA_PREFIX}${JSON.stringify(data)}${SSE_LINE_DELIMITER}`,
		),
	);
}

export const chatService = async (
	docid: string,
	query: string,
	response: Response,
) => {
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

	for await (const event of events) {
		if (event.event === "on_chat_model_stream") {
			console.log(event);
			const token = event.data.chunk;
			if (token) {
				const text = token.content;
				if (text) {
					await sendSSEMessage(response, {
						type: StreamMessageType.Token,
						token: text,
					});
				}
			}
		}
	}
	await sendSSEMessage(response, {
		type: StreamMessageType.Done,
	});
};
