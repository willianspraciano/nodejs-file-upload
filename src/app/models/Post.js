const mongoose = require('mongoose');
const uploadConfig = require('../../config/upload');

const PostSchema = new mongoose.Schema({
  name: String,
  size: Number,
  key: String,
  url: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

PostSchema.pre('save', function () {
  if (!this.url) {
    const formatedImageName = `${encodeURI(this.key)
      .replace(/[{(}]/g, '%28')
      .replace(/[{)}]/g, '%29')
      .replace(/\s/g, '%20')}`;

    const bucketName = uploadConfig.config.aws.bucket;
    const folderName = uploadConfig.config.aws.folder;

    switch (uploadConfig.driver) {
      case 'disk':
        this.url = `${process.env.APP_URL}/files/${formatedImageName}`;
        break;
      case 's3':
        this.url = `https://${bucketName}.s3.amazonaws.com/${folderName}${formatedImageName}`;
        break;
      default:
        this.url = `${process.env.APP_URL}/files/${formatedImageName}`;
    }
  }
});

module.exports = mongoose.model('Post', PostSchema);
