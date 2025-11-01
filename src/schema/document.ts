import z from "zod";

export const documentSchema = z.object({
	mime: z.string(),
	filename: z.string(),
	textContent: z.string(),
	primaryTag: z.string(),
	folderId: z.string().optional(),
	secondaryTags: z.array(z.string()).optional(),
});
