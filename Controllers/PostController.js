import PostModel from "../Models/PostModel.js";
import mongoose from "mongoose";
import UserModel from "../Models/UserModel.js";

// Create New Post
export const createPost = async (req, res) => {
    const newPostData = new PostModel(req.body);
    try {
        await newPostData.save()
        res.status(200).json("Post created successfully")
    } catch (error) {
        res.status(500).json(error)
    }
}

// Get a post
export const getPost = async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await PostModel.findById(postId);
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
    }
}

// Update a Post
export const updatePost = async (req, res) => {
    const postId = req.params.id;
    const {userId} = req.body;
    try {
        const post = await PostModel.findById(postId);
        if (post.userId === userId) {
            await post.updateOne({ $set: req.body })
            res.status(200).json("Post updated successfully")
        } else {
            res.status(403).json("Action forbidden")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

// Delete a Post
export const deletePost = async (req, res) => {
    const postId = req.params.id;
    const {userId} = req.body;
    try {
        const post = await PostModel.findById(postId);
        if (post.userId === userId) {
            await post.deleteOne({ $set: req.body })
            res.status(200).json("Post deleted successfully")
        } else {
            res.status(403).json("Action forbidden")
        }
    } catch (error) {
        res.status(500).json(error)
    } 
}

// Like / Dislike a Post
export const likePost = async (req, res) => {
    const postId = req.params.id;
    const {userId} = req.body;
    try {
        const post = await PostModel.findById(postId);
        if (!post.likes.includes(userId)) {
            await post.updateOne({ $push: { likes: userId }})
            res.status(200).json("Post liked successfully")
        } else {
            await post.updateOne({ $pull: { likes: userId }})
            res.status(200).json("Post unliked successfully")
        }
    } catch (error) {
        res.status(500).json(error)
    } 
}

// Get timeline Posts
export const getTimelinePosts = async (req, res) => {
    const {userId} = req.body;

    try {
        const currentUserPosts = await PostModel.find({ userId: userId });
        const followingPosts = await UserModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "following",
                    foreignField: "userId",
                    as: "followingPosts"
                }
            },
            {
                $project: {
                    followingPosts: 1,
                    _id: 0
                }
            }
        ])
        res
            .status(200)
            .json(currentUserPosts.concat(...followingPosts[0].followingPosts)
                .sort((a,b) => {
                    return b.createdAt - a.createdAt;
                })
            );
    } catch (error) {
        res.status(500).json(error)
    }
}