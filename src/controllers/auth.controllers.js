import { asyncHandler } from "../utils/async-handler.js";
import User from "../models/user.models.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";


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
        console.log("Req.params.token:", req.params.token);
        const { token } = req.params;

        const user = await User.findOne({ emailVerificationToken: token });

        console.log("Request token:", token);
        console.log("User found:", user);

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;

        await user.save();

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
        const user = await User.findOne({ email });
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

        const accessToken = jwt.sign(
            {
                id: user._id, role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h",
            }
        );

        const refreshToken = jwt.sign(
            {
                id: user._id, role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        )

        user.refreshToken = refreshToken
        await user.save();

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        };

        res.cookie("accessToken", accessToken, cookieOptions);
        res.cookie("refreshToken", refreshToken, cookieOptions);

        res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken,
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

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        console.log(user);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.log("Error in get me", error);
    }
}


const logoutUser = asyncHandler(async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id,{refreshToken: undefined});
        res.cookie("token", "", {});
        res.status(200).json({
            success: true,
            message: "logOut successFully"
        })


    } catch (error) {

        console.error("Erron in logOut Function:", error);
        return res.status(500).json({ message: "server error in logout function" });
    }


});


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    console.log(incomingRefreshToken);

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorizad request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Invalid refresh token")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { newAccessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", newAccessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { newAccessToken, token: newRefreshToken },
                    "Access token refreshed"
                )
            )

    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token")
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

const forgotPasswordRequest = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    //validation
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const {currentPassword, newPassword} = req.body;
    console.log(currentPassword, newPassword)
    try {
        const user = await User.findOne(req.user._id);
        console.log(user)
        if(!user){
            res.status(404).json({
                message: "user not found"
            })
        }
    
        const isMatchPassword = await bcrypt.compare(currentPassword, user.password);
        if(!isMatchPassword){
            res.status(404).json({message: "invalid password"})
        }
    
        const salt = await bcrypt.genSalt(10);
        const updatedPassword = await bcrypt.hash(newPassword, salt);
    
        user.password = updatedPassword;
        await user.save()
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
         res.status(500).json({ message: "Error changing password", error: error.message });
    }





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
