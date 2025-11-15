import { model, Schema } from "mongoose";

const userSchema = new Schema(
	{
		email: String,
		password: String,
		name: String,
	},
	{ timestamps: true }
);

const UserModel = model("User", userSchema);

export { UserModel };
