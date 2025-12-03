import z from "zod";

const scopeSchema = z.object({
	type: z.string(),
	name: z.string(),
});

const messageSchema = z.object({
	role: z.string(),
	content: z.string(),
});

export const runActionSchema = z.object({
	scope: scopeSchema,
	messages: z.array(messageSchema),
	actions: z.array(z.string()),
});
