import { Order } from "../models/order.model.js";

const getSummary = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const totalRevenueAgg = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);

    console.log("totalRevenueAgg :: ", totalRevenueAgg);
    const totalRevenue = totalRevenueAgg[0]?.totalRevenue || 0;
    console.log("totalRevenue :: ", totalRevenue);

    const pendingOrders = await Order.countDocuments({ status: "pending" });

    const summary = { totalOrders, totalRevenue, pendingOrders };

    return res.status(200).json({
      success: true,
      message: "Successfully fetched summary analytics...",
      summary,
    });
  } catch (error) {
    console.error("ERROR :: in getSummary controller :: ", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching summary analytics...",
      error:
        error.message ||
        "Something went wrong while fetching summary analytics",
    });
  }
};

const getStatusWiseCounts = async (req, res) => {
  try {
    const statusWiseCounts = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    return res.status(200).json({
      success: true,
      message: "Successfully fetched orders by status...",
      statusWiseCounts,
    });
  } catch (error) {
    console.error("ERROR :: in getStatusWiseCounts controller :: ", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching status wise order count analytics...",
      error:
        error.message ||
        "Something went wrong while fetching status wise order count analytics",
    });
  }
};

const getSalesOverTime = async (req, res) => {
  try {
    const { period = "monthly" } = req.query;

    let groupId = {};

    if (period === "daily") {
      groupId = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
      };
    } else {
      groupId = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      };
    }

    const sales = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: groupId,
          totalSales: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    return res.status(200).json({
      success: true,
      message: "Successfully fetched the sales over time analytics...",
      sales,
    });
  } catch (error) {
    console.error("ERROR :: in getSalesOverTime controller :: ", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching sales over time analytics...",
      error:
        error.message ||
        "Something went wrong while fetching sales over time analytics",
    });
  }
};

const getTopSellingProducts = async (req, res) => {
  try {
    const topSellingProducts = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          name: { $first: "$orderItems.name" },
          totalQuantity: { $sum: "$orderItems.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$orderItems.quantity", "$orderItems.price"] },
          },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
    ]);

    return res.status(200).json({
      success: true,
      message: "Successfully fetched the top selling products analytics...",
      topSellingProducts,
    });
  } catch (error) {
    console.error("ERROR :: in getTopSellingProducts controller :: ", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching top selling products analytics...",
      error:
        error.message ||
        "Something went wrong while fetching top selling products analytics",
    });
  }
};

export default {
  getSummary,
  getStatusWiseCounts,
  getSalesOverTime,
  getTopSellingProducts,
};
