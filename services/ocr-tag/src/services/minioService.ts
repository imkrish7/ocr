import { file } from "zod";
import { minioClient } from "../core/minio.ts";

export const getPresignedURL = async (
	filename: string,
	expiry: number = 300
) => {
	try {
		const bucketName = process.env.MINIO_BUCKET_NAME;
		console.log(bucketName, "BUCKET NAME");
		if (!bucketName) {
			throw new Error("Bucket name is required!");
		}
		const presignedURL = await minioClient.presignedPutObject(
			bucketName,
			filename,
			expiry
		);

		return presignedURL;
	} catch (error) {
		throw error;
	}
};
