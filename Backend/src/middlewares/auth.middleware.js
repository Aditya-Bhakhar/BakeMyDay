import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyJwtToken = async (req, res, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access...",
        error: "Invalid Access Token",
      });
    }

    const decodedInfo = await jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedInfo?._id, {
      password: 0,
      refreshToken: 0,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access...",
        error: "Invalid Access Token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("ERROR :: Error in verifyJwtToken middleware :: ", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access...",
      error: error.message || "Invalid Access Token",
    });
  }
};

export default { verifyJwtToken };
