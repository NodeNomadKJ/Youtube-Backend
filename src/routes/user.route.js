import { Router } from "express";
import {
  userRegisterationController,
  userLoginController,
  userLogoutController,
} from "../controllers/user.controller.js";
import {
  validateUserRegistration,
  handleValidationErrors,
} from "../validation/user.validation.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/register")
  .post(
    validateUserRegistration,
    handleValidationErrors,
    userRegisterationController
  );

router.route("/login").post(userLoginController);

router.route("/logout").post(isAuthenticated, userLogoutController);

export default router;
