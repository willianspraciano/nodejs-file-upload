const fs = require("fs");
const path = require("path");
const aws = require("aws-sdk");
const mime = require("mime");

const UploadConfig = require("../../../../config/upload");

class S3StorageProvider {
  constructor() {
    this.client = new aws.S3({
      region: UploadConfig.config.aws.region,
    });
  }

  async saveFile(fileName) {
    const originalPath = path.resolve(UploadConfig.tmpFolder, fileName);

    const ContentType = mime.getType(originalPath);

    if (!ContentType) throw new Error("File not found");

    const fileContent = await fs.promises.readFile(originalPath);

    await this.client
      .putObject({
        Bucket: UploadConfig.config.aws.bucket,
        Key: fileName,
        ACL: "public-read",
        Body: fileContent,
        ContentType,
        ContentDisposition: `inline; filename=$${fileName}`,
      })
      .promise();

    await fs.promises.unlink(originalPath); // deleta o arquivo depois do upload

    return fileName;
  }

  async deleteFile(fileName) {
    await this.client
      .deleteObject({
        Bucket: UploadConfig.config.aws.bucket,
        Key: fileName,
      })
      .promise();
  }
}

module.exports = S3StorageProvider;
