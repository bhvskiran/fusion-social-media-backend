import UserModel from "../Models/UserModel.js";
import bcrypt from "bcrypt";

// Registering a New User
export const registerUser = async (req, res) => {
    const {username, password, firstname, lastname} = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new UserModel({
        username,
        password: hashedPassword,
        firstname,
        lastname
    })

    try {
        await newUser.save()
        const {password, ...otherDetails} = newUser._doc;
        res.status(200).json(otherDetails);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// Login an User
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username })

        if (user) {
            const validatePassword = await bcrypt.compare(password, user.password);
            if (validatePassword) {
                const {password, ...otherDetails} = user._doc;
                res.status(200).json(otherDetails);
            } else {
                res.status(400).json("Invalid Password")
            }
        } else {
             res.status(404).json("User does not exists")
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}