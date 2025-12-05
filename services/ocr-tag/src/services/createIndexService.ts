import mongoose from "mongoose";
import { DocumentModel } from "../models/document.model.ts";

export const createIndex = async () => {
	try {
		const collections = await mongoose.connection.db
			?.listCollections(
				{},
				{
					raw: false,
				},
			)
			.toArray();
		console.log(collections);
		console.log(DocumentModel.collection.name);
	} catch (error) {
		throw error;
	}
};
