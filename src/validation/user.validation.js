import { body, validationResult } from "express-validator";
import ApiError from "../utils/apiError.js";
import FileDeletionUtil from "../utils/filedeletion.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import {fileValidation} from "../validation/file.validation.js"


const validateUserRegistration = [
  body("userName")
    .trim()
    .notEmpty()
    .withMessage("Username is required.")
    .bail()
    .isString()
    .withMessage("Username must be a string.")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .bail()
    .isEmail()
    .withMessage("Valid email is required.")
    .normalizeEmail(),

  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required.")
    .bail()
    .isString()
    .withMessage("Full name must be a string.")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long."),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .bail()
    .isString()
    .withMessage("Password must be a string.")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),

  // File validation for avatar and coverImage
  fileValidation(
    "avatar",
    ["image/jpeg", "image/jpg", "image/png", "image/gif"],
    "Invalid file type for avatar. Only JPEG, JPG, PNG, and GIF are allowed.",
    true
  ),
  fileValidation(
    "coverImage",
    ["image/jpeg", "image/jpg", "image/png", "image/gif"],
    "Invalid file type for coverImage. Only JPEG, JPG, PNG, and GIF are allowed.",
    false 
  ),
];

// Cleanup function for uploaded files
const cleanupUploadedFiles = async (files) => {
  const avatarFile = files?.avatar?.[0]?.path;
  const coverImageFile = files?.coverImage?.[0]?.path;

  if (avatarFile) {
    await FileDeletionUtil.deleteLocalFile(avatarFile);
  }
  if (coverImageFile) {
    await FileDeletionUtil.deleteLocalFile(coverImageFile);
  }
};

// Middleware to handle validation errors
const handleValidationErrors = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Cleanup any uploaded files
    await cleanupUploadedFiles(req.files);

    // Return validation errors as response
    throw new ApiError(400, "Validation Error", errors.array());
  }
  next();
});

export { validateUserRegistration, handleValidationErrors };
