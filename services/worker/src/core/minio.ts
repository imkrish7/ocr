import * as Minio from "minio";
import fs from "node:fs";
console.log;

export const minioClient = new Minio.Client({
  endPoint: "127.0.0.1",
  port: 9000,
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
  useSSL: false,
});

export const getDocument = async (
  objectName: string,
  bucketName: string,
  filePath: string,
) => {
  try {
    const stream = await minioClient.getObject(bucketName, objectName);

    const buffers: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      stream.on("data", (chunk) => buffers.push(Buffer.from(chunk)));
      stream.on("end", () => resolve());
      stream.on("error", (err) => reject(err));
    });

    const pdfBuffer = Buffer.concat(buffers);

    fs.writeFileSync(filePath, pdfBuffer, "utf-8");
  } catch (error) {
    console.error(error);
    return null;
  }
};
