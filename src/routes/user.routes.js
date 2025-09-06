import express from "express";
import { body } from "express-validator";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";

import {
  userRegistrationValidator,
  emailVerificationValidators,
  userLoginValidators,
  userLogoutValidator,
  getCurrentUserValidator,
  validate
} from "../validators/index.js";

import {
  registerUser,
  verifyEmail,
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshAccessToken,
  changeCurrentPassword,
  forgotPasswordRequest,
  resetForgottenPassword
} from "../controllers/auth.controllers.js";

const router = express.Router();


router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
  ],
  userRegistrationValidator, validate, registerUser
);

router.get("/verify/:token", emailVerificationValidators, validate, verifyEmail);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
  ],
  userLoginValidators, loginUser
)

router.post(
  "/logout",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
  ],
  isAuthenticated,userLogoutValidator, logoutUser
)

router.get("/currentUser", getCurrentUserValidator, validate, isAuthenticated, getCurrentUser);

router.post("/refresh-token", refreshAccessToken )

router.post("/forgotPassword", isAuthenticated, changeCurrentPassword)

router.post("/reset-pass", forgotPasswordRequest)

router.post("/reset-pass/:token", resetForgottenPassword)


export default router