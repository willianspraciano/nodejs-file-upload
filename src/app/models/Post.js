const mongoose = require("mongoose");
const uploadConfig = require("../../config/upload");

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

PostSchema.pre("save", function () {
  if (!this.url) {
    switch (uploadConfig.driver) {
      case "disk":
        this.url = `${process.env.APP_API_URL}/files/${this.key}`;
        break;
      case "s3":
        this.url = `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.key}`;
        break;
      default:
        this.url = `${process.env.APP_URL}/files/${this.key}`;
    }
  }
});

module.exports = mongoose.model("Post", PostSchema);
