import bcrypt from "bcryptjs";
import User from "../models/UserSchema.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { name, username, phoneNumber, email, password, confirmPassword } = req.body;

        if (!name || !username || !phoneNumber || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Password do not match!" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already in use!" });
        }

        const existingUsename = await User.findOne({ username });
        if (existingUsename) {
            return res.status(400).json({ error: "username already in use!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new User({
            name,
            username,
            phoneNumber,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ err: "Internal Server Error" });
    }
};


export const login = async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;

        if (!emailOrUsername || !password) {
            return res.status(400).json({ error: "Please provide an email/username and password!" });
        }

        const user = await User.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
        });

        if (!user) {
            return res.status(401).json({ error: "User not found. Please register first!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect password. Please try again!" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        });

        res.status(200).json({
            success: true,
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Something went wrong! Please try again later." });
    }
};


export const logout = async (req, res) => {
    try {
        res.clearCookie('token', { httpOnly: true, secure: "true", sameSite: "None" });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Logout failed", error: error.message });

    }
};

export const forgotPassword = async (req, res) => {
    const { identifier } = req.body;

    try {
        const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }],
        });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User verified, proceed to reset password", userId: user._id });
        // console.log({ message: "User verified, proceed to reset password" }, { userId: user._id })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}

export const resetPassword = async (req, res) => {
    const { userId, newPassword } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found!" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        return res.status(200).json({ message: "Password updated successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });

    }
}