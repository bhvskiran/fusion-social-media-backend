import express from "express";
import { createPost, deletePost, getPost, getTimelinePosts, likePost, updatePost } from "../Controllers/PostController.js";

const router = express.Router();

// to create a post
router.post("/", createPost)

// to get a post
router.get("/:id", getPost)

// to update a post
router.put("/:id", updatePost)

// to delete a post
router.delete("/:id", deletePost)

// to like/unlike a post
router.put("/:id/like", likePost)

// to get timeline posts
router.get("/", getTimelinePosts)

export default router;