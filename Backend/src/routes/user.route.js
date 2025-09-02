import express from "express";
import userController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  upload.single("profilePhoto"),
  [
    body("email").isEmail().withMessage("Invalid Email..."),
    body("name.firstname")
      .isLength({ min: 2 })
      .withMessage("Firstname must be at least 2 character long..."),
    body("name.lastname")
      .isLength({ min: 2 })
      .withMessage("Lastname must be at least 2 character long..."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 character long..."),
  ],
  (req, res, next) => {
    if (req.body["name.firstname"] || req.body["name.lastname"]) {
      req.body.name = {
        firstname: req.body["name.firstname"],
        lastname: req.body["name.lastname"],
      };
      delete req.body["name.firstname"];
      delete req.body["name.lastname"];
    }

    if (req.file && !req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ errors: [{ msg: "Invalid file type" }] });
    }
    next();
  },
  userController.registerUser
);

router.post(
  "/login",
  [
    body("email").isEmpty().withMessage("Email is required..."),
    body("password").isEmpty().withMessage("Password is required..."),
  ],
  userController.loginUser
);

router.post(
  "/user/refreshToken",
  [body("refreshToken").isEmpty().withMessage("Refresh Token  is missing...")],
  userController.refreshAccessToken
);

// secure routes
router.post(
  "/logout",
  authMiddleware.verifyJwtToken,
  userController.logoutUser
);
router.get(
  "/profile",
  authMiddleware.verifyJwtToken,
  userController.getUserProfile
);

// only admin access routes
router.post(
  "/admin/promoteToAdmin/:userId",
  authMiddleware.verifyJwtToken,
  authMiddleware.checkRoleIsSuperAdmin,
  userController.promoteToAdmin
);

export default router;
