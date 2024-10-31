import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/users.model.js";

export const isAuthenticated = asyncHandler(async (req, _, next) => {
  const incomingAccessToken =
    // req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!incomingAccessToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  let decodedAccessToken;
  try {
    decodedAccessToken = jwt.verify(
      incomingAccessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
  } catch (error) {
    console.error("Access token verification failed:", error.message);
    throw new ApiError(401, "Invalid or expired access token");
  }

  let user;
  try {
    user = await User.findById(decodedAccessToken._id).select("-password");
    if (!user) {
        throw new ApiError(404, "User not found");
      }
  } catch (error) {
    throw new ApiError(
      500,
      "Error occurred while fetching user data during authentication"
    );
  }

  const loggedInSession = user.sessions?.length
    ? user.sessions.find(
        (session) => session.sessionId === decodedAccessToken.sessionId
      )
    : null;

  if (!loggedInSession) {
    console.warn(
      `Session invalid or expired for user ID: ${user._id}, session ID: ${decodedAccessToken.sessionId}`
    );
    throw new ApiError(401, "Session invalid or expired. Please log in again.");
  }
  const { sessions, ...userWithoutSessions } = user.toObject();
  req.user = userWithoutSessions;
  req.sessionId = decodedAccessToken.sessionId
  next();
});
