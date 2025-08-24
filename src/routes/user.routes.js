import express from "express";
import { body } from "express-validator";
import { userRegistrationValidator } from "../validators/index.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
  ],
  userRegistrationValidator,
  (req, res) => {
    res.json({ msg: "registration success!", data: req.body });
  }
);



export default router