import express from "express";
import userController from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  upload.single("profilePhoto"),
  [
    body("email").isEmail().withMessage("Invalid Email..."),
    body("firstname").isLength({ min: 3 }).withMessage("Firstname must be at least 3 character long..."),
    body("lastname").isLength({ min: 3 }).withMessage("Lastname must be at least 3 character long..."),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 character long..."),
  ],
  userController.registerUser
);

export default router;
