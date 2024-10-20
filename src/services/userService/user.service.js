import ApiError from "../../utils/apiError.js";
import { User } from "../../models/users.model.js";
import uploadCloudinary from "../../services/cloudinaryService/clodinary.service.js";
import FileDeletionUtil from "../../utils/filedeletion.js";

const registerUser = async ({ userName, email, fullName, password, files }) => {
  // Check if user already exists
  const isExistingUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (isExistingUser) {
    await cleanupUploadedFiles(files);
    throw new ApiError(409, "User with Email or Username already exists");
  }

  // Initialize file paths and upload files to Cloudinary
  const avatarFile = files?.avatar?.[0]?.path;
  const coverImageFile = files?.coverImage?.[0]?.path;
  let avatarUploaded = null;
  let coverImageUploaded = null;

  try {
    if (avatarFile) {
      avatarUploaded = await uploadCloudinary(avatarFile);
    }
    if (coverImageFile) {
      coverImageUploaded = await uploadCloudinary(coverImageFile);
    }
  } catch (error) {
    throw new ApiError(500, "File upload failed", error);
  }

  // Create the user
  let user;
  try {
    user = await User.create({
      userName,
      fullName,
      email,
      avatar: avatarUploaded?.url || "",
      coverImage: coverImageUploaded?.url || "",
      password,
    });

    // Convert Mongoose document to plain object and remove sensitive fields
    user = user.toObject();
    delete user.password;
    delete user.refreshToken;
  } catch (error) {
    await handleCloudinaryCleanup([avatarUploaded?.url, coverImageUploaded?.url]);
    throw new ApiError(500, "User creation failed", error);
  }

  return user;
};

// Cleanup uploaded files
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

// Handle Cloudinary cleanup
const handleCloudinaryCleanup = async (fileUrls) => {
  for (const url of fileUrls) {
    if (url) {
      await FileDeletionUtil.deleteCloudinaryFile(url);
    }
  }
};

export default { registerUser };
