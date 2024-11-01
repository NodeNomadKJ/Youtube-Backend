import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      minlength: 5,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minlength: 3,
    },
    avatar: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: Schema.ObjectId,
        ref: "video",
      },
    ],
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    sessions: [
      {
        sessionId: { type: String, unique: true },
        refreshToken: String,
      },
    ],
  },
  { timestamps: true }
);

// Pre-save hook to hash the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//Generating Jwt
userSchema.methods.generateAccessToken = function (sessionId) {
  try {
    const token = jwt.sign(
      {
        _id: this._id,
        userName: this.userName,
        sessionId
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
    return token;
  } catch (error) {
    throw new Error("Error generating access token");
  }
};

userSchema.methods.generateRefreshToken = function (sessionId) {
  try {
    const token = jwt.sign(
      {
        _id: this._id,
        sessionId
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );
    return token;
  } catch (error) {
    throw new Error("Error generating refresh token");
  }
};

export const User = mongoose.model("User", userSchema);
