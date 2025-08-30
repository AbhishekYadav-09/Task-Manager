import { asyncHandler } from "../utils/async-handler.js";
import User from "../models/user.models.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    console.log(email)
    if (!username || !email || !password) {
        return res.status(400).json({
            message: "All filed requred!"
        })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return res.status(400).json({
            message: "User already register"
        })
    }

    const user = await User.create({
        username,
        email,
        password,
    });

    if (!user) {
        return res.status(400).json({
            message: "User not registered",
        });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = token;
    user.isVerified = false;
    console.log(token)

    await user.save();
    res.status(201).json({
        message: "User registered successfully, please verify your email",
        verificationUrl: `${process.env.BASE_URL}/api/v1/users/verify/${token}`,
        user: {
            id: user._id,
            email: user.email,
            username: user.username,
        }
    });

});

const verifyEmail = asyncHandler(async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({ emailVerificationToken: token });
        console.log(user)
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        user.isVerified = true;
        user.emailVerificationToken = undefined;

        await user.save();

        console.log("✅ User verified successfully!");

        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });

    } catch (error) {
        console.error(" Error verifying email:", error);
        return res.status(500).json({ message: "Server error" });
    }
});



const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({
                massage: "Invalid email and pass!"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                  message: "Invalid email or password!"
            })
        }

        const token = jwt.sign(
            {
                id: user._id, role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h",
            }
        );

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        };

        res.cookie("token", token, cookieOptions);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(" Error in login function:", error);
        return res.status(500).json({ message: "Server error in login function" });
    }

});

const logoutUser = asyncHandler(async (req, res) => {
    try {
        res.cookie("token", "",{});
        res.status(200).json({
            success: true,
            message: "logOut successFully"
        })
    } catch (error) {
        console.error("Erron in logOut Function:", error);
        return res.status(500).json({message:"server error in logout function"});
    }
});


const resendEmailVerification = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    //validation
});
const resetForgottenPassword = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    //validation
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    //validation
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    //validation
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    //validation
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    //validation
});

export {
    changeCurrentPassword,
    forgotPasswordRequest,
    getCurrentUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    resendEmailVerification,
    resetForgottenPassword,
    verifyEmail,
};
