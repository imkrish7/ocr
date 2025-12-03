import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../core/auth.ts";
import { RefreshModel } from "../models/refreshToken.model.ts";

export const authMiddleware = async (
	request: Request,
	response: Response,
	next: NextFunction
) => {
	try {
		const authHeaders = request.headers.authorization || "";
		const refreshToken = request.cookies.refreshToken;
		if (!refreshToken) {
			return response.status(401).json({ error: "Unauthorized" });
		}
		if (!authHeaders) {
			return response.status(401).json({ error: "Unauthorized" });
		}
		const authToken = authHeaders.split(" ")[1];
		if (!authToken) {
			return response.status(401).json({ error: "Unauthorized" });
		}

		const payload = await verifyToken(authToken);
		// check refresh token validity
		const isRefreshTokenExist = await RefreshModel.findOne({
			userId: payload.sub,
			token: refreshToken,
		});

		if (!isRefreshTokenExist) {
			return response.status(401).json({ error: "Unauthorized" });
		}

		if (isRefreshTokenExist.revoked) {
			return response.status(401).json({ error: "Unauthorized" });
		}

		request.user = payload;
		return next();
	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: "Internal server error" });
	}
};
