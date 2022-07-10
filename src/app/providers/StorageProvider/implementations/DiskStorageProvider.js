const fs = require("fs");
const path = require("path");
const UploadConfig = require("../../../../config/upload");

class DiskStorageProvider {
  async saveFile(fileName) {
    await fs.promises.rename(
      path.resolve(UploadConfig.tmpFolder, fileName),
      path.resolve(UploadConfig.uploadsFolder, fileName)
    );

    return fileName;
  }

  async deleteFile(fileName) {
    const filePath = path.resolve(UploadConfig.uploadsFolder, fileName);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

module.exports = DiskStorageProvider;
