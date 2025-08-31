import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import orderController from "../controllers/order.controller.js";
import { body } from "express-validator";

const router = express.Router();

// protected and only admin accessible routes
router.get(
  "/all",
  authMiddleware.verifyJwtToken,
  authMiddleware.checkRoleIsAdmin,
  orderController.getAllOrders
);

router.patch(
  "/:orderId/updateOrderStatus",
  authMiddleware.verifyJwtToken,
  authMiddleware.checkRoleIsAdmin,
  orderController.updateOrderStatus
);

// protected - user accessible routes

router.post(
  "/online",
  [
    body("shippingAddress")
      .notEmpty()
      .withMessage("Shipping address can not be empty"),
  ],
  authMiddleware.verifyJwtToken,
  orderController.createOnlineOrder
);

router.post(
  "/COD",
  [
    body("shippingAddress")
      .notEmpty()
      .withMessage("Shipping address can not be empty"),
  ],
  authMiddleware.verifyJwtToken,
  orderController.createCODOrder
);

router.post(
  "/verify",
  authMiddleware.verifyJwtToken,
  orderController.verifyPayment
);

router.post(
  "/fail",
  authMiddleware.verifyJwtToken,
  orderController.paymentFailed
);

router.get("/my", authMiddleware.verifyJwtToken, orderController.getMyOrders);

router.get(
  "/:orderId",
  authMiddleware.verifyJwtToken,
  orderController.getOrderById
);

export default router;
