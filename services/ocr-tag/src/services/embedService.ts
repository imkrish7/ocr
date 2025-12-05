import { OllamaEmbeddings } from "@langchain/ollama";

export const getQueryEmbedding = async (query: string) => {
	try {
		const embedder = new OllamaEmbeddings({
			model: "embeddinggemma",
		});

		const embedding = await embedder.embedQuery(query);
		return embedding;
	} catch (error) {
		throw error;
	}
};
