import express from "express";
import cartController from "../controllers/cart.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { body } from "express-validator";

const router = express.Router();

// protected public accessible routes
router.post(
  "/add",
  [
    body("productId").notEmpty().withMessage("Product Id must be required."),
    body("quantity")
      .notEmpty()
      .withMessage("Quantity can not be empty.")
      .isInt({ min: 0 })
      .withMessage("Quantity must be positive integer."),
    body("price")
      .notEmpty()
      .withMessage("Price can not be empty.")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),
  ],
  authMiddleware.verifyJwtToken,
  cartController.addToCart
);

router.put(
  "/update/:productId",
  [
    body("quantity")
      .notEmpty()
      .withMessage("Quantity can not be empty.")
      .isInt({ min: 0 })
      .withMessage("Quantity must be positive integer."),
  ],
  authMiddleware.verifyJwtToken,
  cartController.updateCart
);

router.delete(
  "/remove/:productId",
  authMiddleware.verifyJwtToken,
  cartController.removeFromCart
);

router.get("/", authMiddleware.verifyJwtToken, cartController.getCart);

export default router;
