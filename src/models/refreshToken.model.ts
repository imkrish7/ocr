import { model, Schema } from "mongoose";

const refreshToken = new Schema(
	{
		userId: Schema.ObjectId,
		token: String,
		deviceInfo: {
			userAgent: String,
			deviceId: String,
		},
		ip: String,
		expiresAt: Date,
		revoked: Boolean,
		lastUsedAt: Date,
	},
	{ timestamps: true }
);

export const RefreshModel = model("refreshToken", refreshToken);
