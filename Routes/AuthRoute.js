import express from "express";
import { loginUser, registerUser } from "../Controllers/AuthController.js";

const router = express.Router()

// to register an User
router.post("/register", registerUser);

// to login User
router.post("/login", loginUser);

export default router;