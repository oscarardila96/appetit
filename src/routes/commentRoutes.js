import { Router } from "express";
import { createComment, deleteComment, updateComment } from "../controllers/commentController.js";
import authMiddleware from '../middlewares/auth.js'
const router = Router();


router
    .post('/:id/:place', createComment)
    .put('/edit/:id', authMiddleware, updateComment)
    .delete('/:id', deleteComment)

export default router;