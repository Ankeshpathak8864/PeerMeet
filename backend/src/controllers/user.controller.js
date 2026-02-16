import httpStatus from "http-status";
import {User} from "../models/user.model.js";
import bcrypt,{hash} from "bcrypt";
import crypto from "crypto";


const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "please provide" });
    }

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        let token = crypto.randomBytes(20).toString("hex");
        user.token = token;
        await user.save();

        return res.status(httpStatus.OK).json({ token });

    } catch (e) {
        return res.status(500).json({ message: `something went wrong ${e}` });
    }
};

const register = async (req, res) => {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
        return res.status(400).json({ message: "All fields required" });
    }

    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            username,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({ message: "User registered successfully" });

    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        });
    }
};


const addToHistory = async (req, res) => {
    try {
        const { meetingCode } = req.body;

        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.history = user.history || [];
     user.history.push({
    meetingCode,
    date: new Date()
});


        await user.save();

        return res.status(200).json({ message: "History added" });

    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};


const getUserHistory = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ history: user.history || [] });

    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};


export { login, register, addToHistory, getUserHistory }


