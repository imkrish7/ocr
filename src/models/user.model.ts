import { model, Schema } from "mongoose";

const userSchema = new Schema(
	{
		email: String,
		password: String,
		name: String,
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

const UserModel = model("User", userSchema);

export { UserModel };
