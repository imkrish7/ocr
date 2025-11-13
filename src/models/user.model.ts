import { model, Schema } from "mongoose";

const userSchema = new Schema(
	{
		email: String,
		password: String,
		name: String,
		role: {
			type: String,
			enum: ["admin", "user", "moderator", "legal"],
			required: true,
		},
	},
	{ timestamps: true }
);

const UserModel = model("User", userSchema);

export { UserModel };
