import type { Request, Response } from "express";
import { UserModel } from "../models/user.model.ts";

export const getUserController = async (
	request: Request,
	response: Response
) => {
	try {
		const user = request.user;

		if (!user) {
			return response.status(403).json({ error: "Forbidden" });
		}
		const userDetail = await UserModel.findById(user.sub);

		if (!userDetail) {
			return response.status(404).json({ error: "User does not exist" });
		}
		return response.status(200).json({
			data: {
				email: userDetail?.email,
				name: userDetail?.name,
			},
		});
	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: "Internal server error!" });
	}
};
