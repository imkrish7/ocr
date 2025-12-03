import z from "zod";

export const loginSchema = z.object({
	username: z.email(),
	password: z.string(),
});

export const signupSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
	name: z.string().min(3),
});
