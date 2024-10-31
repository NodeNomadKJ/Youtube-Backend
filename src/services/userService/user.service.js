import ApiError from "../../utils/apiError.js";
import { User } from "../../models/users.model.js";
import { v4 as uuidv4 } from "uuid";

const generateAccessAndRefreshToken = async (validUser) => {
  const sessionId = uuidv4();
  const accessToken = validUser.generateAccessToken(sessionId);
  const refreshToken = validUser.generateRefreshToken(sessionId);
  if (validUser.sessions.length >= 4) {
    validUser.sessions.shift();
  }

  validUser.sessions.push({ sessionId, refreshToken });
  await validUser.save();

  return { accessToken, refreshToken };
};

const registerUserService = async ({ userName, email, fullName, password }) => {
  const isExistingUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (isExistingUser) {
    throw new ApiError(409, "User with Email or Username already exists");
  }

  let user;
  try {
    user = await User.create({
      userName,
      fullName,
      email,
      password,
    });

    user = user.toObject();
    delete user.password;
    delete user.sessions;
    delete user.watchHistory;
  } catch (error) {
    throw new ApiError(500, "User creation failed", error);
  }

  return user;
};

const loginUserService = async ({ userName, password }) => {
  if (!userName || !password) {
    throw new ApiError(401, "Username and Password is mandatory");
  }
  let validUser = await User.findOne({ userName });
  if (!validUser) {
    throw new ApiError(404, "Username is Incorrect or does not Exist");
  }
  if (!(await validUser.isPasswordCorrect(password))) {
    throw new ApiError(401, "Password is not Correct");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    validUser
  );

  validUser = validUser.toObject();
  delete validUser.password;
  delete validUser.sessions;
  delete validUser.watchHistory;

  return { validUser, accessToken, refreshToken };
};
const logoutUserService = async ({ userId, sessionId }) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(
        404,
        "You are trying to logout a user that does not exist"
      );
    }
    user.sessions = user.sessions.filter(
      (session) => session.sessionId !== sessionId
    );
    await user.save();
  } catch (error) {
    throw new ApiError(500, "Error logging out", error);
  }
};

export default { registerUserService, loginUserService, logoutUserService};
