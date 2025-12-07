import { Worker } from "bullmq";
import { DocumentProcessing } from "../services/embedingService.ts";

export const documentWorker = new Worker(
  "document",
  async (job) => {
    console.dir(job.data, job.name);
    switch (job.name) {
      case "DOCUMENT_UPLOADED":
        await DocumentProcessing(job.data);
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
