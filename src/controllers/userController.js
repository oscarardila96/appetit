import User from '../models/User.js';
import generateJWT from '../helpers/generateJWT.js';
import emailRegister from '../helpers/emailRegister.js';
import emailNewPassword from '../helpers/forgottenPasswordEmail.js';
import comparePassword from '../helpers/comparePassword.js';

const registerUser = async (req, res) => {
  const { email, name } = req.body;
  const existUser = await User.findOne({ email });

  if (existUser) {
    const error = new Error('Usuario ya registrado');
    res.status(200).json({ message: error.message });
  }
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    emailRegister({ email, name, token: savedUser.token });
    res.status(201).json({ _id: savedUser.id, name: savedUser.name, email: savedUser.email });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const userProfile = async (req, res) => {
  try {
    const profile = await User.findById(req.params.userId).lean().select('-password');
    if (!profile) {
      const error = new Error('El usuario no existe');
      res.status(404).json({ message: error.message });
    }

    res.json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const confirmUser = async (req, res) => {
  const { token } = req.params;
  const userConfirm = await User.findOne({ token });

  if (!userConfirm) {
    const error = new Error('Token no válido');
    res.status(401).json({ message: error.message });
  }
  try {
    userConfirm.token = null;
    userConfirm.confirmed = true;
    await userConfirm.save();
    res.json({ message: 'Usuario confirmado correctamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const authenticateUser = async (req, res) => {
  const { email, password } = req.body;
  const result = await comparePassword({ email, password });
  if (!result) {
    const error = new Error('El usuario no existe');
    res.status(404).json({ message: error.message });
  }
  if (result.isValid) {
    const { _id, email, name, img_avatar: imgAvatar } = result.user;
    const userData = { email, _id, name, imgAvatar };
    const token = generateJWT(userData);
    userData.token = token;
    res.json(userData);
  } else {
    const error = new Error('La contraseña es incorrecta');
    res.status(401).json({ message: error.message });
  }
};

const forgottenPassword = async (req, res) => {
  const { email } = req.body;
  const existUser = await User.findOne({ email });
  if (!existUser) {
    const error = new Error('El usuario no existe');
    res.status(404).json({ message: error.message });
  }
  try {
    existUser.token = generateJWT();
    await existUser.save();
    emailNewPassword({
      email,
      name: existUser.name,
      token: existUser.token,
    });
    res.json({
      message: 'Se ha enviado un email con las instrucciones para cambiar la contraseña',
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const newUserPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const user = await User.findOne({ token });
  if (!user) {
    const error = new Error('El usuario no existe');
    res.status(404).json({ message: error.message });
  }
  try {
    user.password = password;
    await user.save();
    res.json({ message: 'Contraseña modificada correctamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addSavedPost = async (req, res) => {
  const { postId } = req.body;
  const { userId } = req.params;
  try {
    const result = await User.findByIdAndUpdate(userId, { $addToSet: { savedPosts: postId } });
    if (result) res.json({ message: 'Publicación guardada correctamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addFavoritePost = async (req, res) => {
  const { postId } = req.body;
  const { userId } = req.params;

  try {
    await User.findByIdAndUpdate(userId, { $addToSet: { favorites: postId } });
    res.json({ message: 'Publicación añadida a favoritos correctamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const followUser = async (req, res) => {
  const { userId, userToFollowId } = req.body;

  try {
    if (!userId || !userToFollowId) {
      return res.status(400).send({ message: 'Debe proporcionar los IDs de usuario' });
    }

    if (userId === userToFollowId) {
      return res.send({ message: 'No puedes seguirte a ti mismo' });
    }

    const user = await User.findById(userId);
    const userToFollow = await User.findById(userToFollowId); //Buscamos al usuario que deseamos seguir

    if (!user || !userToFollow) {
      return res.send({ message: 'Usuario no encontrado' });
    }

    if (user.following.includes(userToFollowId)) {
      return res.send({ message: 'Ya sigues a este usuario' });
    }

    user.following.push(userToFollowId);
    await user.save();
    res.status(200).json({ message: 'Has comenzado a seguir a este usuario' });

    userToFollow.followers.push(userId); // Agregar el ID del usuario seguidor al arreglo de followers del otro usuario
    await userToFollow.save(); //Guardar los cambios del otro usuario (usuario al que se sigue)
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { userToUnfollowId } = req.body;

    if (!userId || !userToUnfollowId) {
      return res.send({ message: 'Debe proporcionar los IDs de usuario' });
    }

    if (userId === userToUnfollowId) {
      return res.send({ message: 'No puedes dejar de seguirte a ti mismo' });
    }

    const user = await User.findById(userId);
    const userToUnfollow = await User.findById(userToUnfollowId); //Buscar al usuario que se desea dejar de seguir

    if (!user) {
      return res.send({ message: 'Usuario no encontrado' });
    }

    if (!user.following.includes(userToUnfollowId)) {
      return res.send({ message: 'No sigues a este usuario' });
    }

    user.following.pull(userToUnfollowId);
    await user.save();
    res.status(200).json({ message: 'Has dejado de seguir a este usuario' });

    userToUnfollow.followers.pull(userId);
    await userToUnfollow.save();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate('following', 'name email');

    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(user.following);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addFavoriteUser = async (req, res) => {
  try {
    const { userId, userToAddId } = req.body;

    if (!userId || !userToAddId) {
      res.status(400).json({ message: 'Debe proporcionar los IDs de usuario' });
    }

    if (userId === userToAddId) {
      res.status(400).json({ message: 'No puedes agregarte a ti mismo a favoritos' });
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (user.favoriteUsers.includes(userToAddId)) {
      res.status(400).json({ message: 'Este usuario ya está en tus favoritos' });
    }

    user.favoriteUsers.push(userToAddId);

    await user.save();

    res.status(200).json({ message: 'Usuario agregado a favoritos correctamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const removeFavoriteUser = async (req, res) => {
  try {
    const { userId, userToRemoveId } = req.body;

    if (!userId || !userToRemoveId) {
      res.status(400).json({ message: 'Debe proporcionar los IDs de usuario' });
    }

    if (userId === userToRemoveId) {
      res.status(400).json({ message: 'No puedes eliminarte a ti mismo de favoritos' });
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (!user.favoriteUsers.includes(userToRemoveId)) {
      res.status(400).json({ message: 'Este usuario no está en tus favoritos' });
    }

    user.favoriteUsers = user.favoriteUsers.filter((id) => id.toString() !== userToRemoveId.toString());
    await user.save();
    res.status(200).json({ message: 'Usuario eliminado de favoritos correctamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  registerUser,
  userProfile,
  confirmUser,
  authenticateUser,
  forgottenPassword,
  newUserPassword,
  addSavedPost,
  addFavoritePost,
  followUser,
  unfollowUser,
  getFollowing,
  addFavoriteUser,
  removeFavoriteUser,
};
