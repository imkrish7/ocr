import z from "zod";

export const documentSchema = z.object({
	mime: z.string(),
	filename: z.string(),
	textContent: z.string(),
	primaryTag: z.string(),
	folderId: z.string().optional(),
	secondaryTags: z.array(z.string()).optional(),
});

export const presignedURLSchema = z.object({
	mime: z.string(),
	filename: z.string(),
});

export const uploadStatusUpdateSchema = z.object({
	docid: z.string(),
	status: z.enum(["UPLOADED", "FAILED"]),
});

export const chatDocumentSchema = z.object({
	query: z.string().min(2),
});
