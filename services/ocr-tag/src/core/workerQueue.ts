import { Queue } from "bullmq";

const workerQueue = new Queue("document", {
	connection: {
		host: "localhost",
		port: 6379,
	},
});

export { workerQueue };
