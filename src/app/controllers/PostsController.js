const Post = require('../models/Post');
const StorageProvider = require('../providers/StorageProvider');

class PostsController {
  async create(req, res) {
    if (!req.file)
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });

    const { originalname: name, size, key, location: url = '' } = req.file;

    const storageProvider = new StorageProvider();

    await storageProvider.saveFile(key);

    const post = await Post.create({
      name,
      size,
      key,
      url,
    });
    return res.json(post);
  }

  async index(req, res) {
    const posts = await Post.find();

    return res.json(posts);
  }

  async delete(req, res) {
    const { id } = req.params;

    const storageProvider = new StorageProvider();

    const post = await Post.findById(id);

    if (!post) return res.status(400).json({ error: 'Post não encontrado' });

    const fileName = post.key;

    await post.remove();
    await storageProvider.deleteFile(fileName);

    return res.send();
  }
}

module.exports = PostsController;
