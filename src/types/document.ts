export interface IDocument {
	folderId: string;
	createdAt: Date;
	ownerId: string;
	filename: string;
	mime: string;
	textContent: string;
}

export interface IPresignedURL {
	filename: string;
}
