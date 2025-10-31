import { Schema, model } from "mongoose";

const taskSchema = new Schema(
	{
		status: {
			type: String,
			enum: ["pending", "processing"],
			default: "pending",
		},
		target: String,
		channel: String,
	},
	{ timestamps: true }
);

const TaskModel = model("Task", taskSchema);
export { TaskModel };
