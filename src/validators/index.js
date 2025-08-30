import { body, validationResult } from "express-validator"
import { param } from "express-validator";
import { header } from "express-validator";

const userRegistrationValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid"),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("username is required")
    .isLength({ min: 3 })
    .withMessage("username should be at least 3 char")
    .isLength({ max: 13 })
    .withMessage("username cannot exceed 13 char"),
];


export const emailVerificationValidators = [
  param("token").notEmpty().withMessage("Verification token is required")
];

export const userLoginValidators = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid"),

  body("password")
    .notEmpty()
    .withMessage("Enter the password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const userLogoutValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid"),

  body("password")
    .notEmpty()
    .withMessage("Enter the password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const getCurrentUserValidator = [
  header("Authorization")
    .exists()
    .withMessage("Authorization header is required")
    .custom((value) => {
      if (!value.startsWith("Bearer ")) {
        throw new Error("Authorization header must start with Bearer");
      }
      return true;
    }),
];



const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

export { userRegistrationValidator, validate };


