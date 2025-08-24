import { validationResult } from "express-validator";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
        errors: errors.array(),
      });
    }

    const {
      salutation,
      firstname,
      lastname,
      email,
      password,
      age,
      phoneNumber,
    } = req.body;

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
      profilePhoto = await uploadOnCloudinary(req.file.buffer, "BackMyDay");
      console.log("profilePhoto ::", profilePhoto);

      if (!profilePhoto) {
        return res.status(400).json({
          success: false,
          message: "Profile photo is required...",
        });
      }
    }

    const createdUser = await User.create({
      name: {
        salutation,
        firstname,
        lastname,
      },
      email,
      password,
      age,
      phoneNumber,
      profilePhoto: profilePhoto?.secure_url,
    });
    return res.status(201).json({
      success: true,
      message: "User registered successfully...",
      user: createdUser,
    });
  } catch (error) {
    console.error("ERROR :: in registerUser controller :: ", error);
    return res.status(500).json({
      success: false,
      message: "Error while registeing user...",
      error: error,
    });
  }
};

export default { registerUser };
