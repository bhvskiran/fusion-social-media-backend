import express from "express";
import { getUser, updateUser, deleteUser, followUser, unFollowUser } from "../Controllers/UserController.js";

const router = express.Router();

// to get the user details without password field
router.get("/:id", getUser);

// to update the userdetails
router.put("/:id", updateUser);

// to delete the user
router.delete("/:id", deleteUser);

// to follow an User
router.put("/:id/follow", followUser)

// to unfollow an user
router.put("/:id/unfollow", unFollowUser)

export default router;