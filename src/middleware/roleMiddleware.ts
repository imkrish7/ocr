import type { NextFunction, Request, Response } from "express";
import { RoleModel } from "../models/role.model.ts";

export const roleMiddleware = (
	requiredRoles: string[] = [],
	requiredAction = null
) => {
	return async (request: Request, response: Response, next: NextFunction) => {
		try {
			let user = request.user;
			if (!user) {
				return response.status(401).json({ error: "Unauthorized" });
			}

			const userRole = await RoleModel.findById(user.role);

			if (!userRole) {
				return response
					.status(403)
					.json({ error: "Permission denied!" });
			}

			if (requiredRoles.indexOf(userRole.name) < 0) {
				return response
					.status(403)
					.json({ error: "Permission denied!" });
			}
			return next();
		} catch (error) {
			console.error(error);
			return response
				.status(500)
				.json({ error: "Internal server error" });
		}
	};
};
