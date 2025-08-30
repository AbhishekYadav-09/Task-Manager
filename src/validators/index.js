import {body, validationResult} from "express-validator"
import { param } from "express-validator";

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


export const emailVerificationValidators = ()=>[
  param("token")
  .notEmpty().withMessage("Token is requ")
  .isString().withMessage("Token must be a string")
];


















const userLoginValidator = () => {
  return [
    body("email").isEmail().withMessage("Email is not valid"),
    body("password").notEmpty().withMessage("Password cannot be empty"),
  ];
};


const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  next();
};

export { userRegistrationValidator, userLoginValidator, validate};


