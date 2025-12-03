import z from "zod";

export const webhookSchema = z.object({
	source: z.string(),
	imageId: z.string(),
	text: z.string(),
	meta: z
		.record(z.string(), z.union([z.string(), z.number(), z.null()]))
		.optional(),
});
