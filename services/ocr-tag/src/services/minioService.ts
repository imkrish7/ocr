import { file } from "zod";
import { minioClient } from "../core/minio.ts";

export const getPresignedURL = async (
	filename: string,
	expiry: number = 300,
) => {
	try {
		const bucketName = process.env.MINIO_BUCKET_NAME;
		if (!bucketName) {
			throw new Error("Bucket name is required!");
		}
		const presignedURL = await minioClient.presignedPutObject(
			bucketName,
			filename,
			expiry,
		);

		return presignedURL;
	} catch (error) {
		throw error;
	}
};

export const getDocumentViewURL = async (object: string) => {
	try {
		const bucketName = process.env.MINIO_BUCKET_NAME;
		if (!bucketName) {
			throw new Error("Bucket name is required!");
		}
		const presignedURL = await minioClient.presignedGetObject(
			bucketName,
			object,
			300,
		);
		return presignedURL;
	} catch (error) {
		throw error;
	}
};
