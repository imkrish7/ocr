import type { Request, Response } from "express";
import { loginSchema, signupSchema } from "../schema/auth.ts";
import { UserModel } from "../models/user.model.ts";
import { signPayload } from "../core/auth.ts";

export const loginController = async (request: Request, response: Response) => {
	try {
		const validateRequest = loginSchema.safeParse(request.body);
		if (validateRequest.error) {
			return response.status(400).json({ error: "Bad request!" });
		}

		const isUserExist = await UserModel.findOne({
			email: validateRequest.data.email,
		});

		if (!isUserExist) {
			return response.status(401).json({ error: "User does not exist" });
		}

		if (isUserExist.password !== validateRequest.data.password) {
			return response.status(401).json({ error: "Wrong password!" });
		}

		const accessToken = await signPayload({
			email: isUserExist.email!,
			id: isUserExist._id.toString(),
		});

		return response.status(200).json({ accessToken });
	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: "Internal server error" });
	}
};

export const signupController = async (
	request: Request,
	response: Response
) => {
	try {
		const validateRequest = signupSchema.safeParse(request.body);
		if (validateRequest.error) {
			return response.status(400).json({ error: "Bad request!" });
		}

		const isUserExist = await UserModel.findOne({
			email: validateRequest.data.email,
		});

		if (isUserExist) {
			return response.status(400).json({ error: "User already exist!" });
		}

		const newUser = new UserModel({
			name: validateRequest.data.name,
			email: validateRequest.data.email,
			password: validateRequest.data.password,
		});

		await newUser.save();
		return response.status(200).json({ details: "User created" });
	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: "Internal server error" });
	}
};
