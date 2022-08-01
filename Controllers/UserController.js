import UserModel from "../Models/UserModel.js";
import bcrypt from "bcrypt";

// get a user
export const getUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await UserModel.findById(id);

        if (user) {
            const {password, ...otherDetails} = user._doc

            res.status(200).json(otherDetails)
        } else {
            res.status(404).json("User does not exists");
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

// update the user
export const updateUser = async(req, res) => {
    const id = req.params.id;

    const {currentUserId, currentUserAdminStatus} = req.body;

    if (id === currentUserId || currentUserAdminStatus) {
        try {
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } 
            const user = await UserModel.findByIdAndUpdate(id, req.body, {new: true});
            const {password, ...otherDetails} = user._doc;
            res.status(200).json(otherDetails);
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json("Access Denied! You can only update your own profile");
    }
}

// Delete an User
export const deleteUser = async (req, res) => {
    const id = req.params.id;

    const {currentUserId, currentUserAdminStatus} = req.body;

    if (id === currentUserId || currentUserAdminStatus) {
        try {
            await UserModel.findByIdAndDelete(id);
            res.status(200).json("User deleted successfully.")
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json("Access Denied! You can only delete your own profile");
    }
}

// Follow a user
export const followUser = async (req, res) => {
    const id = req.params.id;

    const {followingUserId} = req.body;

    if (id == followingUserId) {
        res.status(403).json("Action forbidden")
    } else {
        try {
            const followUser = await UserModel.findById(id);
            const followingUser = await UserModel.findById(followingUserId);
            if (followUser && followingUser) {
                if (!followUser.following.includes(followingUserId)) {
                    await followUser.updateOne({ $push: {following: followingUserId}})
                    await followingUser.updateOne({ $push: {followers: id}})
                    res.status(200).json("User followed successfully!")
                } else {
                    res.status(403).json("User is already followed by you. Please check")
                }
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

// unFollow a user
export const unFollowUser = async (req, res) => {
    const id = req.params.id;

    const {followingUserId} = req.body;

    if (id == followingUserId) {
        res.status(403).json("Action forbidden")
    } else {
        try {
            const followUser = await UserModel.findById(id);
            const followingUser = await UserModel.findById(followingUserId);
            if (followUser && followingUser) {
                if (followUser.following.includes(followingUserId)) {
                    await followUser.updateOne({ $pull: {following: followingUserId}})
                    await followingUser.updateOne({ $pull: {followers: id}})
                    res.status(200).json("User unfollowed successfully!")
                } else {
                    res.status(403).json("User is not followed by you")
                }
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
}