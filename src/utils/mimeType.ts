const mimeType: Record<string, string> = {
	txt: "text/plain",
	pdf: "application/pdf",
	jpg: "image/jpeg",
	jpeg: "image/jpeg",
	png: "image/png",
	gif: "image/gif",
};

export const getMimeType = (filename: string) => {
	const extension = filename.split(".")[1];
	return extension ? mimeType[extension] : "uknown";
};
