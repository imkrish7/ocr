import type { Request, Response } from "express";
import { loginSchema, signupSchema } from "../schema/auth.ts";
import { UserModel } from "../models/user.model.ts";
import { signPayload, verifyToken } from "../core/auth.ts";
import { AccessControlModel } from "../models/accessControl.model.ts";
import { RefreshModel } from "../models/refreshToken.model.ts";
import { RoleModel } from "../models/role.model.ts";
import { FolderModel } from "../models/folder.model.ts";
import mongoose from "mongoose";

export const loginController = async (request: Request, response: Response) => {
	try {
		const validateRequest = loginSchema.safeParse(request.body);
		if (validateRequest.error) {
			return response.status(400).json({ error: "Bad request!" });
		}
		const isUserExist = await UserModel.findOne({
			email: validateRequest.data.username,
		});

		if (!isUserExist) {
			return response.status(401).json({ error: "User does not exist" });
		}

		if (isUserExist.password !== validateRequest.data.password) {
			return response.status(401).json({ error: "Wrong password!" });
		}

		const accessControl = await AccessControlModel.findOne({
			userId: isUserExist._id,
		});

		const { accessToken, refreshToken } = await signPayload({
			email: isUserExist.email!,
			sub: isUserExist._id.toString(),
			role: accessControl?.roleId.toString()!,
		});

		const saveRefreshToken = new RefreshModel({
			userId: isUserExist._id,
			token: refreshToken,
			ip: request.ip,
			deviceInfo: {
				userAgent:
					request.get("User-Agent") || request.get("user-agent"),
				// deviceId: request.coo,
			},
			revoked: false,
			lastUsedAt: Date.now(),
			expiresAt: new Date(new Date().getHours() + 24).getMilliseconds(),
		});

		await saveRefreshToken.save();

		return response
			.status(200)
			.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				secure: false,
				sameSite: "lax",
			})
			.json({ accessToken });
	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: "Internal server error" });
	}
};

export const signupController = async (
	request: Request,
	response: Response
) => {
	// let session = await mongoose.startSession();
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

		// await session.startTransaction();

		let newUser = new UserModel({
			name: validateRequest.data.name,
			email: validateRequest.data.email,
			password: validateRequest.data.password,
		});

		let rootFolder = new FolderModel({
			name: `folder-${Date.now()}-${newUser._id.toString()}`,
			typeOf: "root",
			alias: "root",
			ownerId: newUser._id,
			createdBy: newUser._id,
			metadata: {
				description: "Its a root folder",
			},
		});

		let checkAdminRoleExist = await RoleModel.findOne({ name: "admin" });
		if (!checkAdminRoleExist) {
			checkAdminRoleExist = new RoleModel({
				name: "admin",
				permissions: [
					{
						resource: "folder",
						actions: ["read", "write", "delete", "update"],
					},
				],
			});
		}

		const newAccessControl = new AccessControlModel({
			userId: newUser._id,
			resourceId: rootFolder._id,
			resourceType: "folder",
			roleId: checkAdminRoleExist._id,
		});

		await newUser.save();
		await rootFolder.save();
		await checkAdminRoleExist.save();
		await newAccessControl.save();
		// await session.commitTransaction();
		// await session.endSession();
		return response.status(200).json({ details: "User created" });
	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: "Internal server error" });
	}
};

export const refreshTokenController = async (
	request: Request,
	response: Response
) => {
	const refreshToken = request.cookies.refreshToken;

	if (!refreshToken) {
		return response.status(401).json({ error: "Unauthorized" });
	}

	try {
		const refreshPayload = await verifyToken(refreshToken);

		const isRefreshTokenExist = await RefreshModel.findOne({
			userId: refreshPayload.sub,
			token: refreshToken,
		});

		if (!isRefreshTokenExist) {
			return response.status(401).json({ error: "Unauthorized" });
		}

		if (isRefreshTokenExist.revoked) {
			return response.status(401).json({ error: "Unauthorized" });
		}

		const { accessToken, refreshToken: newRefreshToken } =
			await signPayload({
				...refreshPayload,
			});

		await RefreshModel.findByIdAndUpdate(isRefreshTokenExist._id, {
			revoked: true,
			lastUsedAt: Date.now(),
		});

		const saveRefreshToken = new RefreshModel({
			userId: isRefreshTokenExist.userId,
			token: newRefreshToken,
			ip: request.ip,
			deviceInfo: {
				userAgent:
					request.get("User-Agent") || request.get("user-agent"),
				deviceId: request.cookies.deviceId,
			},
			revoked: false,
			lastUsedAt: Date.now(),
			expiresAt: new Date(new Date().getHours() + 24).getMilliseconds(),
		});

		await saveRefreshToken.save();

		return response
			.status(200)
			.cookie("refreshToken", newRefreshToken, {
				httpOnly: true,
				secure: false,
				sameSite: "lax",
			})
			.json({ accessToken });
	} catch (error) {
		console.error(error);
		return response.status(500).json({ error: "Internal server error" });
	}
};
