import Post from '../models/Post.js';
import User from '../models/User.js';

const createPost = async (req, res) => {
  const { id, title, description, category, difficulty, ingredients, preparation, portions, country, images } =
    req.body;

  try {
    let post = new Post({
      author: id,
      title,
      description,
      category,
      difficulty,
      ingredients,
      preparation,
      portions,
      country,
      images,
    });

    await post.save();

    await User.findByIdAndUpdate(id, { $push: { posts: post._id } });

    res.send(post);
  } catch (error) {
    console.log(error.message);
  }
};

const getPostByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const posts = await Post.find({ author: userId }).populate('author');
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al obtener los posts del usuario' });
  }
};

const getPostByPostId = async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al obtener el post' });
  }
};

const getPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.json(post);
  } catch (error) {
    console.log(error.message);
  }
};
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, description, images, category, difficulty, ingredients, preparation, portions, country } = req.body;
  //const images = req.files;

  try {
    let modifiedPost = await Post.findOneAndUpdate(
      { _id: id },
      { title, description, images, category, difficulty, ingredients, preparation, portions, country }
    );

    if (!modifiedPost) {
      return res.send({ message: 'Esta publicación no existe.' });
    }
    let post = await Post.findById({ _id: id });
    res.send(post);
  } catch (error) {
    console.log(error.message);
  }
};
const likePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Verificar si el usuario ya dio like al post
    const alreadyLiked = post.likes.some((like) => like.user.toString() === userId);

    if (alreadyLiked) {
      return res.status(400).json({ message: 'Post ya tiene me gusta' });
    }

    // Agregar el like al post
    post.likes.push({ user: userId });
    await post.save();

    res.json(post.likes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const unlikePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Verificar si el usuario no ha dado like al post
    const notLiked = post.likes.every((like) => like.user.toString() !== userId);

    if (notLiked) {
      return res.status(400).json({ message: 'Post no tiene me gusta' });
    }

    // Remover el like del post
    post.likes = post.likes.filter((like) => like.user.toString() !== userId);
    await post.save();

    res.json(post.likes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTopPosts = async (req, res) => {
  try {
    const topPosts = await Post.aggregate([
      { $unwind: '$likes' },

      { $group: { _id: '$_id', likes: { $sum: 1 } } },

      { $sort: { likes: -1 } },

      { $limit: 10 },

      { $lookup: { from: 'posts', localField: '_id', foreignField: '_id', as: 'post' } },

      { $unwind: '$post' },

      { $project: { _id: '$post._id', title: '$post.title', likes: 1 } },
    ]);

    res.json(topPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPostsByDate = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // Si no se especifica el límite, traer 10 por defecto
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(limit);
    res.json(posts);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Error al obtener los posts' });
  }
};

export {
  createPost,
  updatePost,
  getPostByPostId,
  getPostByUserId,
  likePost,
  getPosts,
  unlikePost,
  getTopPosts,
  getPostsByDate,
};
