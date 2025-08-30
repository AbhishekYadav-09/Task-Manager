import express from "express";
import { body } from "express-validator";
import { 
  userRegistrationValidator, 
  emailVerificationValidators,
  userLoginValidators,
  userLogoutValidator,
  validate 
} from "../validators/index.js";
import { registerUser, verifyEmail, loginUser,logoutUser } from "../controllers/auth.controllers.js";

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

router.get("/verify/:token", emailVerificationValidators, verifyEmail);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({min:6}).withMessage("Password must be at least 6 chars"),
  ],
  userLoginValidators, loginUser
)

router.post(
  "/logout",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({min:6}).withMessage("Password must be at least 6 chars"),
  ],
  userLogoutValidator, logoutUser
)



export default router