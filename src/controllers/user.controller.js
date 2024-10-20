import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import userService from "../services/userService/user.service.js"

const userRegisteration = asyncHandler(async (req, res) => {
  const { userName, email, fullName, password } = req.body;
  
  // Call the service to handle user registration logic
  const user = await userService.registerUser({
    userName,
    email,
    fullName,
    password,
    files: req.files
  });

  // Return response with created user data
  return res
    .status(201)
    .json(new ApiResponse(201, "User Registered Successfully", user));
});

export { userRegisteration };
