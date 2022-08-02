const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

module.exports = {
  driver: process.env.STORAGE_DRIVER,

  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex');

        const originalname = file.originalname
          .replace(/\s/g, '_')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^\w.]/g, '');

        const fileName = `${fileHash}-${file.originalname}`;

        file.key = fileName;

        return callback(null, fileName);
      },
    }),
    fileFilter: (req, file, callback) => {
      const allowedMimes = [
        'image/jpeg',
        'image/pjpeg',
        'image/png',
        'image/gif',
      ];

      if (allowedMimes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new Error('Invalid file type.'));
      }
    },
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
  },
  config: {
    disk: {},
    aws: {
      bucket: process.env.S3_BUCKET_NAME ?? '',
      region: process.env.S3_BUCKET_REGION ?? '',
      folder: process.env.S3_BUCKET_FOLDER ?? '',
    },
  },
};
