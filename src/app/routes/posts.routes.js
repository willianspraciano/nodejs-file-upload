const postsRoutes = require('express').Router();
const multer = require('multer');
const uploadConfig = require('../../config/upload');

const upload = multer(uploadConfig.multer);

const PostsController = require('../controllers/PostsController');
const postsController = new PostsController();

postsRoutes.get('/', postsController.index);
postsRoutes.post('/', upload.single('file'), postsController.create);
postsRoutes.delete('/:id', postsController.delete);

module.exports = postsRoutes;
