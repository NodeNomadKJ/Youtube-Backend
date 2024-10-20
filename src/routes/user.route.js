import { Router } from "express";
import { userRegisteration } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { validateUserRegistration,handleValidationErrors } from "../validation/user.validation.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  validateUserRegistration,
  handleValidationErrors,
  userRegisteration
);

export default router;
