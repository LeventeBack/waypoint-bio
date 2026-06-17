import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Storage } from "@google-cloud/storage";
import { randomUUID } from "node:crypto";

// The subset of a multer file
export interface UploadedImage {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

@Injectable()
export class StorageService {
  private readonly bucketName = process.env.GCS_BUCKET ?? "";
  private readonly storage = new Storage(
    process.env.GCS_KEY_FILE ? { keyFilename: process.env.GCS_KEY_FILE } : {},
  );

  async uploadImage(file: UploadedImage, prefix: string): Promise<string> {
    if (!this.bucketName) {
      throw new InternalServerErrorException("GCS_BUCKET is not configured");
    }

    const ext = file.originalname.includes(".")
      ? file.originalname.split(".").pop()!.toLowerCase()
      : "bin";

    const objectName = `${prefix}/${randomUUID()}.${ext}`;
    const blob = this.storage.bucket(this.bucketName).file(objectName);
    await blob.save(file.buffer, { contentType: file.mimetype, resumable: false });

    return `https://storage.googleapis.com/${this.bucketName}/${objectName}`;
  }
}
