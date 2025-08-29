import express from "express";
import productController from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { body } from "express-validator";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// protected and only admin accessible routes

router.post(
  "/add",
  upload.single("productImage"),
  [
    body("name")
      .notEmpty()
      .withMessage("Product name cannot be empty.")
      .isLength({ min: 2 })
      .withMessage("Product name must be alteast 2 character long..."),
    body("price")
      .notEmpty()
      .withMessage("Product price cannot be empty.")
      .isFloat({ min: 0 })
      .withMessage("Product price must be positive number"),
    body("description")
      .notEmpty()
      .withMessage("Product description cannot be empty.")
      .isLength({ min: 5 })
      .withMessage("Product description must be atleat 6 characters long"),
    body("category")
      .notEmpty()
      .withMessage("Product category cannot be empty.")
      .isIn(["cheesecake", "cake", "cookie", "pastry", "brownie", "other"])
      .withMessage("Product category does not belongs to predined categories."),
  ],
  authMiddleware.verifyJwtToken,
  authMiddleware.checkRoleIsAdmin,
  productController.addProduct
);

router.patch(
  "/update/:productId",
  [
    body("name")
      .optional()
      .isLength({ min: 2 })
      .withMessage("Product name must be alteast 2 character long..."),
    body("price")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Product price must be positive number"),
    body("description")
      .optional()
      .isLength({ min: 5 })
      .withMessage("Product description must be atleat 6 characters long"),
    body("category")
      .optional()
      .isIn(["cheesecake", "cake", "cookie", "pastry", "brownie", "other"])
      .withMessage("Product category does not belongs to predined categories."),
  ],
  authMiddleware.verifyJwtToken,
  authMiddleware.checkRoleIsAdmin,
  productController.updateProduct
);

router.patch(
  "/update-product-image/:productId",
  upload.single("productImage"),
  authMiddleware.verifyJwtToken,
  authMiddleware.checkRoleIsAdmin,
  productController.updatedProductImage
);

router.delete(
  "/remove/:productId",
  authMiddleware.verifyJwtToken,
  authMiddleware.checkRoleIsAdmin,
  productController.removeProduct
);

// protected public accessible routes

router.get(
  "/",
  authMiddleware.verifyJwtToken,
  productController.getAllProducts
);

router.get(
  "/:productId",
  authMiddleware.verifyJwtToken,
  productController.getProductById
);

export default router;
