const uploadConfig = require("../../../config/upload");

const DiskStorageProvider = require("./implementations/DiskStorageProvider");
const S3StorageProvider = require("./implementations/S3StorageProvider");

const providers = {
  disk: DiskStorageProvider,
  s3: S3StorageProvider,
};

module.exports = providers[uploadConfig.driver];
