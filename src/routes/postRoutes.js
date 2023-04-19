import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import {
  createPost,
  getPostByUserId,
  updatePost,
  likePost,
  unlikePost,
  getTopPosts,
  getPostsByDate,
  getPostByPostId,
} from '../controllers/postController.js';

const router = express.Router();

router.post('/', authMiddleware, createPost);
router.put('/:id', updatePost);

router.get('/:postId', getPostByPostId);
router.get('/:userId/posts', getPostByUserId);
router.post('/:id/like', likePost);
router.delete('/posts/:id/unlike', unlikePost);
router.get('/posts/top', getTopPosts);
router.get('/posts/ordered', getPostsByDate);

export default router;

/**
 * @openapi
 * /api/v1/posts:
 *   post:
 *     summary: Creates a new post.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Required fields to create a new post.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schema/createPost'
 *     tags:
 *       - [Posts]
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
 */
