import { Worker } from "bullmq";

export const documentWorker = new Worker(
  "document",
  async (job) => {
    switch (job.data.type) {
      case "DOCUMENT_UPLOADED":
        // await createDocument(job.data);
        break;
      case "uploaded":
        // await updateDocument(job.data);
        break;
      case "delete":
        // await deleteDocument(job.data);
        break;
      default:
        console.log("Uknown job");
    }
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  },
);
