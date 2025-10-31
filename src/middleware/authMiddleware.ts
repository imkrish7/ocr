import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../core/auth.ts";

export const authMiddleware = async (
	request: Request,
	response: Response,
	next: NextFunction
) => {
	try {
		const authHeaders = request.headers.authorization || "";
		if (!!authHeaders) {
			return response.status(401).json({ error: "Unauthorized" });
		}
		const authToken = authHeaders.split(" ")[1];
		if (!authToken) {
			return response.status(401).json({ error: "Unauthorized" });
		}

		const payload = await verifyToken(authToken);

		request.user = payload;
		return next();
	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: "Internal server error" });
	}
};
