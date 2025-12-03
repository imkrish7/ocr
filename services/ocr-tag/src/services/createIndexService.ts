import mongoose, { type Model } from "mongoose";

interface IField {
	type: string;
	path: string;
	dimensions: number;
	similarity: string;
	quantization: string;
}

export const checkIndexExist = async (model: Model<any>, indexName: string) => {
	const collection = model.collection;
	const indexes = await collection.listIndexes().toArray();
	if (indexes.some((index) => index.name === indexName)) {
		return true;
	}
	return false;
};

export const createIndex = async (
	model: Model<any>,
	indexName: string,
	type: string,
	fields: IField[],
) => {
	const collection = model.collection;

	await collection.createSearchIndex({
		name: indexName,
		type,
		definition: {
			fields: fields,
		},
	});
};
