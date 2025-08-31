import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import analyticsController from "../controllers/analytics.controller.js";

const router = express.Router();

// protected - user accessible routes

router.get(
  "/orders/summary",
  authMiddleware.verifyJwtToken,
  authMiddleware.checkRoleIsAdmin,
  analyticsController.getSummary
);

router.get(
  "/orders/statusWiseCounts",
  authMiddleware.verifyJwtToken,
  authMiddleware.checkRoleIsAdmin,
  analyticsController.getStatusWiseCounts
);

router.get(
  "/orders/salesOverTime",
  authMiddleware.verifyJwtToken,
  authMiddleware.checkRoleIsAdmin,
  analyticsController.getSalesOverTime
);

router.get(
  "/orders/topSellingProducts",
  authMiddleware.verifyJwtToken,
  authMiddleware.checkRoleIsAdmin,
  analyticsController.getTopSellingProducts
);

export default router;
