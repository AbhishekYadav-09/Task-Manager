import express from "express";
import { body } from "express-validator";
import { userRegistrationValidator, emailVerificationValidators ,validate } from "../validators/index.js";
import { registerUser, verifyEmail } from "../controllers/auth.controllers.js";

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



export default router