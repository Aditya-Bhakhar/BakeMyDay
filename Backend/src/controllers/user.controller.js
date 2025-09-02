import { validationResult } from "express-validator";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
        error: errors.array(),
      });
    }

    const { name, email, password, age, phoneNumber } = req.body;

    const file = req.file;

    console.log("req.body ::", req.body);
    console.log("req.file ::", req.file);

    const existedUser = await User.findOne({ email });

    if (existedUser) {
      return res.status(409).json({
        success: false,
        message: "User already registered with this email...",
      });
    }

    let profilePhoto;

    // if (!req.file) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Profile photo is required...",
    //   });
    // }

    if (req.file) {
      profilePhoto = await uploadOnCloudinary(
        req.file.buffer,
        "BakeMyDay/User Profile Pictures"
      );
      console.log("profilePhoto ::", profilePhoto);

      if (!profilePhoto) {
        return res.status(400).json({
          success: false,
          message: "Profile photo is required...",
        });
      }
    }

    const createdUser = await User.create({
      name,
      email,
      password,
      age,
      phoneNumber,
      profilePhoto: profilePhoto?.secure_url,
    });

    const user = await User.findOne({ email }, { password: 0 });

    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong while registering the user...",
      });
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully...",
      user: user,
    });
  } catch (error) {
    console.error("ERROR :: in registerUser controller :: ", error);
    return res.status(500).json({
      success: false,
      message: "Error while registeing user...",
      error: error.message || "Something went wrong while registering user",
    });
  }
};

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validationBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error(
      "ERROR :: Error while genrating access and refresh tokens :: ",
      error
    );
    throw new Error("Error while genrating access and refresh tokens...");
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials!!!",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Error while user login...",
        error: "Invalid credentials!!!",
      });
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Error while user login...",
        error: "Invalid credentials!!!",
      });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    if (!accessToken || !refreshToken) {
      return res.status(500).json({
        success: false,
        message: "Error while user login...",
        error: "Error while generating access and refresh tokens",
      });
    }

    const loggedInUser = await User.findOne(
      { email },
      { password: 0, refreshToken: 0 }
    );

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        message: "User logged in successfully...",
        user: loggedInUser,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    console.error("ERROR :: in loginUser controller :: ", error);
    return res.status(500).json({
      success: false,
      message: "Error while user login...",
      error: error.message || "Something went wrong while user login",
    });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body();

    if (!refreshToken) throw new Error("Refresh Token is missing...");

    const user = await User.findOne({ refreshToken: refreshToken });

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Invalid Refresh Token...",
        error:
          error.message || "Something went wrong while refreshing access token",
      });
    }

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, decoded) => {
        if (error) {
          return res.status(403).json({
            success: false,
            message: "Invalid or expired refresh token..",
            error:
              error.message ||
              "Something went wrong while refreshing access token",
          });
        }

        const accessToken = user.generateAccessToken();
        return res.status(200).json({
          success: true,
          message: "Access token refreshed successfully...",
          accessToken,
        });
      }
    );
  } catch (error) {
    console.error("ERROR :: in refreshAccessToken controller :: ", error);
    return res.status(500).json({
      success: false,
      message: "Error while refreshing access token...",
      error:
        error.message || "Something went wrong while refreshing access token",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Error while logout user...",
        error: "Invalid Access Token",
      });
    }

    await User.findByIdAndUpdate(
      { _id: user?._id },
      { $set: { refreshToken: "" } },
      { new: true }
    );

    const options = { httpOnly: true, secure: true, sameSite: "none" };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ success: true, message: "User logged out successfully..." });
  } catch (error) {
    console.error("ERROR :: in logoutUser controller :: ", error);
    return res.status(500).json({
      success: false,
      message: "Error while user logout...",
      error: error.message || "Something went wrong while user logout",
    });
  }
};

const getUserProfile = (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Error while getting user profile...",
        error: "User not found...",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully...",
      user: user,
    });
  } catch (error) {
    console.error("ERROR :: in getUserProfile controller :: ", error);
    return res.status(500).json({
      success: false,
      message: "Error while getting user profile...",
      error: error.message || "Something went wrong while getting user profile",
    });
  }
};

const promoteToAdmin = async (req, res) => {
  try {
    const userId = req.params?.userId;

    if (!userId) {
      throw new Error("UserId is required...");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found to assign admin role...");
    }

    if (user?.role !== "user") {
      return res.status(400).json({
        success: false,
        message: "Error while promoting user role to admin...",
        error: `User already has role as ${user?.role}`,
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { role: "admin" } },
      {
        projection: {
          password: 0,
          refreshToken: 0,
        },
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "User role successfully promoted to Admin role...",
      user: updatedUser,
    });
  } catch (error) {
    console.error("ERROR :: in promoteToAdmin controller :: ", error);
    return res.status(500).json({
      success: false,
      message: "Error while promoting from User to Admin...",
      error:
        error.message ||
        "Something went wrong while promoting from User to Admin",
    });
  }
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getUserProfile,
  promoteToAdmin,
};
