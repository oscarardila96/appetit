import { Router } from 'express';
import authMiddleware from '../middlewares/auth.js';
import {
  registerUser,
  authenticateUser,
  confirmUser,
  userProfile,
  forgottenPassword,
  newUserPassword,
  addSavedPost,
  addFavoritePost,
  followUser,
  unfollowUser,
  getFollowing,
  addFavoriteUser,
  removeFavoriteUser,
} from '../controllers/userController.js ';

const router = Router();

router.post('/register', registerUser);
router.get('/confirm/:token', confirmUser);
router.post('/authenticate', authenticateUser);
router.put('/forgotten-password', forgottenPassword);
router.put('/forgotten-password/:token', newUserPassword);
router.get('/profile/:userId', userProfile); // YA, FALTA EL OBJETO QUE DEVUELVE
router.post('/:userId/saved-posts', authMiddleware, addSavedPost);
router.post('/:userId/favorite-posts', authMiddleware, addFavoritePost);
router.post('/follow', authMiddleware, followUser);
//router.delete('/unfollow', authMiddleware, unfollowUser);
router.delete('/unfollow/:userId', authMiddleware, unfollowUser);
router.get('/:userId/following', authMiddleware, getFollowing);
router.post('/favorite-users', authMiddleware, addFavoriteUser);
router.delete('/favorite-users', authMiddleware, removeFavoriteUser);

export default router;

/**
 * @openapi
 * /api/v1/users/register:
 *   post:
 *     summary: Creates a new user into app's database.
 *     requestBody:
 *       description: Required fields to create a new user.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schema/register'
 *     tags:
 *       - [Users]
 *     responses:
 *       201:
 *         description: Created success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/registerResponse'
 *       200:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario ya registrado
 * /api/v1/users/authenticate:
 *   post:
 *     summary: Logs an user into the app.
 *     requestBody:
 *       description: Required fields to log in an user.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: andres@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     tags:
 *       - [Users]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/loginResponse'
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El usuario no existe
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: La contraseña es incorrecta
 * /api/v1/users/confirm/{token}:
 *   get:
 *     summary: Completes email confirmation to authorize user.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           minimum: 1
 *         description: Token
 *     tags:
 *       - [Users]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario confirmado correctamente
 *       401:
 *         description: Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token inválido
 * /api/v1/users/forgotten-password:
 *   put:
 *     summary: Receives a user email address and sends back and email to set up a new password.
 *     requestBody:
 *       description: Required information to reset the password.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: andres@gmail.com
 *     tags:
 *       - [Users]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Se ha enviado un email con las instrucciones para cambiar la contraseña
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El usuario no existe
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /api/v1/users/forgotten-password/{token}:
 *   get:
 *     summary: Allows the user to create a new password.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *           minimum: 1
 *         description: Token
 *     requestBody:
 *       description: Required fields to allow the user to create a new password.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: password123
 *     tags:
 *       - [Users]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contraseña modificada correctamente
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El usuario no existe
 * /api/v1/users/profile/{userId}:
 *   get:
 *     summary: Returns a user profile based on the ID provided.
 *     parameters:
 *       - in: path
 *         name: User ID
 *         required: true
 *         schema:
 *           type: string
 *           minimum: 1
 *         description: ID
 *     tags:
 *       - [Users]
 *     responses:
 *       201:
 *         description: Created success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/user-profile'
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El usuario no existe
 * /api/v1/users/{userId}/saved-posts:
 *   post:
 *     summary: Adds a post to the user's Saved Posts list.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: User ID
 *         required: true
 *         schema:
 *           type: string
 *           minimum: 1
 *         description: User ID
 *     requestBody:
 *       description: Required fields to add a post to the user's Saved Posts list.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 example: nisdfusi0239239
 *     tags:
 *       - [Users]
 *     responses:
 *       201:
 *         description: Created success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Publicación guardada correctamente
 *       400:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error
 * /api/v1/users/{userId}/favorite-posts:
 *   post:
 *     summary: Adds a post to the user's Favorite Posts list.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: User ID
 *         required: true
 *         schema:
 *           type: string
 *           minimum: 1
 *         description: User ID
 *     requestBody:
 *       description: Required fields to add post to the user's Favorites list
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 example: nisdfusi0239239
 *     tags:
 *       - [Users]
 *     responses:
 *       201:
 *         description: Created success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Publicación añadida a favoritos correctamente
 *       400:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error
 * /api/v1/users/follow:
 *   post:
 *     summary: Adds an account to the user's Following list.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Required fields to follow another user.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: nisdfusi0239239
 *               userToFollowId:
 *                 type: string
 *                 example: dacni3029rdncxk
 *     tags:
 *       - [Users]
 *     responses:
 *       201:
 *         description: Created success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Has comenzado a seguir a este usuario
 *       400:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Debe proporcionar los dos IDs de usuario / No puedes seguirte a ti mismo / Ya sigues a este usuario
 *       404:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario no encontrado
 * /api/v1/users/unfollow:
 *   delete:
 *     summary: Removes an account from the user's Following list.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Required fields to unfollow another user.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: nisdfusi0239239
 *               userToUnfollowId:
 *                 type: string
 *                 example: dacni3029rdncxk
 *     tags:
 *       - [Users]
 *     responses:
 *       204:
 *         description: No content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Has dejado de seguir a este usuario
 *       400:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Debe proporcionar los dos IDs de usuario / No puedes dejar de seguirte a ti mismo / No sigues a este usuario
 *       404:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario no encontrado
 * /api/v1/users/{userId}/following:
 *   get:
 *     summary: Returns the list of the accounts the user follows.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: User ID
 *         required: true
 *         schema:
 *           type: string
 *           minimum: 1
 *         description: ID
 *     tags:
 *       - [Users]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: [dnaosidn2353234, 134rwfnsdvon34, o34no4i5ntwefd]
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario no encontrado
 * /api/v1/users/favorite-users:
 *   post:
 *     summary: Adds an account to the user's Favorite Users list.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Required fields to add an account to the user's Favorite Users list.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: nisdfusi0239239
 *               userToAddId:
 *                 type: string
 *                 example: dacni3029rdncxk
 *     tags:
 *       - [Users]
 *     responses:
 *       201:
 *         description: Created success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario agregado a favoritos correctamente
 *       400:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Debe proporcionar los dos IDs de usuario / No puedes agregarte a ti mismo a favoritos/ Este usuario ya está en tus favoritos
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario no encontrado
 * /api/v1/users/favorite-users/delete:
 *   delete:
 *     summary: Removes an account from the user's Favorite Users list.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Required fields to remove an account from the user's Favorite Users list.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: nisdfusi0239239
 *               userToRemoveId:
 *                 type: string
 *                 example: dacni3029rdncxk
 *     tags:
 *       - [Users]
 *     responses:
 *       204:
 *         description: No content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario eliminado de favoritos correctamente
 *       400:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Debe proporcionar los dos IDs de usuario / No puedes eliminarte a ti mismo de favoritos / Este usuario no está en tus favoritos.
 *       404:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario no encontrado
 */

// const user = {
//   "_id": { "$oid": "643e11431bc97dcd0e27f24b" },
//   "name": "la chamba",
//   "email": "lachambaservices@gmail.com",
//   "password": "$2a$10$hdms9W0mCU9enpCNwL.QBOTr.230zAVhKVtHpMvGZOotLJKze1rPu",
//   "admin": true,
//   "img_avatar": "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
//   "favorites": [],
//   "followers": [{ "$oid": "643cd40c4003b4c968200f33" }],
//   "following": [{ "$oid": "643cc31e8cd091f81ddb7920" }, { "$oid": "643cc31e8cd091f81ddb7920" }, { "$oid": "643cd40c4003b4c968200f33" }, { "$oid": "643cd40c4003b4c968200f33" }],
//   "isOnline": false,
//   "posts": [],
//   "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODE3NzU0NDksImV4cCI6MTY4NDM2NzQ0OX0.D6MIaV5fodUKjzNbVOMVl_B5kGmemdk6MJ-LSOunAAjves5WnTJ4fvFU7_M15xWRkYwekL143wWEwG6Si1KsHQ",
//   "savedPosts": [],
//   "favoriteUsers": [],
//   "createdAt": "2023-04-17T03:54:17.688+00:00",
//   "updatedAt": "2023-04-17T03:54:17.688+00:00",
//   "id": "1gu8oqs9a65larc97dfg"
// }
