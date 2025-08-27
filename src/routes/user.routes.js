import express from "express";
import { body } from "express-validator";
import { userRegistrationValidator, validate } from "../validators/index.js";
import { registerUser } from "../controllers/auth.controllers.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
  ],
  userRegistrationValidator, registerUser
);



export default router