import { Schema, Types, model } from "mongoose";

const taskSchema = new Schema(
	{
		status: {
			type: String,
			enum: ["pending", "processing"],
			default: "pending",
		},
		target: String,
		channel: String,
		userId: Types.ObjectId,
	},
	{ timestamps: true }
);

const TaskModel = model("Task", taskSchema);
export { TaskModel };
