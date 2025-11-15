import z from "zod";

export const createFolder = z.object({
	parentId: z.string().refine(
		(value) => {
			if (value.length > 0) {
				return true;
			}
			return false;
		},
		{ message: "Parent folder is required!" }
	),
	name: z.string().min(3, "Folder name is required!"),
});
