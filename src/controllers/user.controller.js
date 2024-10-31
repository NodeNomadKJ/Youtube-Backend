import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import userService from "../services/userService/user.service.js";
import { options } from "../constants/constants.js";

const userRegisterationController = asyncHandler(async (req, res) => {
  const { userName, email, fullName, password } = req.body;

  const user = await userService.registerUserService({
    userName,
    email,
    fullName,
    password,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "User Registered Successfully", user));
});

const userLoginController = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;
  const { validUser, accessToken, refreshToken } =
    await userService.loginUserService({ userName, password });
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "user Authenticated Successfully", {
        user: validUser,
        accessToken,
        refreshToken,
      })
    );
});

const userLogoutController = asyncHandler(async (req, res) => {
   const userId = req.user._id;
   const sessionId =req.sessionId
   await userService.logoutUserService({userId,sessionId});
   return res
      .status(200)
      .clearCookie("accessToken",options)
      .clearCookie("refreshToken",options)
      .json(
        new ApiResponse(200, "User has been logged out successfully")
      )
})

export { userRegisterationController, userLoginController, userLogoutController };
