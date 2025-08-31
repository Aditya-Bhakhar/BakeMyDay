import { validationResult } from "express-validator";
import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import { log } from "console";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOnlineOrder = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) throw new Error("Unauthorized...");

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid data...",
        error: errors.array(),
      });
    }

    const { shippingAddress } = req.body;
    const { address, city, state, country, pincode } = shippingAddress;

    if (!address || !city || !state || !country || !pincode) {
      throw new Error(
        "Shipping address has missing some info which are required..."
      );
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty...");
    }

    let totalPrice = 0;
    const orderItems = [];

    for (let item of cart.items) {
      const product = await Product.findById(item.product._id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product._id}`,
          error: "Product not found...",
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      });

      totalPrice += product.price * item.quantity;
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: totalPrice * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    const order = await Order.create({
      user: userId,
      orderItems,
      status: "pending",
      totalPrice,
      shippingAddress,
      paymentStatus: "pending",
      paymentDetails: {
        orderId: razorpayOrder.id,
      },
    });

    cart.items = [];

    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully...",
      order,
      razorpayOrder,
    });
  } catch (error) {
    console.error("ERROR :: in createOnlineOrder controller :: ", error);
    return res.status(500).json({
      success: false,
      messgae: "Error while placing order...",
      error: error.message || "Something went wrong while placing order",
    });
  }
};

const createCODOrder = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) throw new Error("Unauthorized...");

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid data...",
        error: errors.array(),
      });
    }

    const { shippingAddress } = req.body;
    const { address, city, state, country, pincode } = shippingAddress;

    if (!address || !city || !state || !country || !pincode) {
      throw new Error(
        "Shipping address has missing some info which are required..."
      );
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty...");
    }

    let totalPrice = 0;
    const orderItems = [];

    for (let item of cart.items) {
      const product = await Product.findById(item.product._id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product._id}`,
          error: "Product not found...",
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      });

      totalPrice += product.price * item.quantity;
    }

    const order = await Order.create({
      user: userId,
      orderItems,
      status: "pending",
      totalPrice,
      shippingAddress,
      paymentStatus: "pending",
      paymentMethod: "COD",
    });

    cart.items = [];

    await cart.save();

    return res.status(201).json({
      success: true,
      message: "COD Order created successfully...",
      order,
    });
  } catch (error) {
    console.error("ERROR :: in createCODOrder controller :: ", error);
    return res.status(500).json({
      success: false,
      messgae: "Error while creating COD order...",
      error: error.message || "Something went wrong while creating COD order",
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    const sign = razorpay_payment_id + "|" + razorpay_order_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");
    // console.log("expectedSign ::", expectedSign);

    if (expectedSign === razorpay_signature) {
      const order = await Order.findOne({
        "paymentDetails.orderId": razorpay_order_id,
      });

      if (order) {
        order.status = "processing";
        order.paymentStatus = "paid";
        order.paidAt = Date.now();
        order.paymentDetails.paymentId = razorpay_payment_id;
        order.paymentDetails.signature = razorpay_signature;
        await order.save();
      }

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully...",
        order,
      });
    } else {
      return res.status(400).json({
        success: true,
        message: "Invalid signature, Payment verification failed...",
      });
    }
  } catch (error) {
    console.error("ERROR :: in verifyPayment controller :: ", error);
    return res.status(500).json({
      success: false,
      messgae: "Error while verifying payment...",
      error: error.message || "Something went wrong while varifying payment",
    });
  }
};

const paymentFailed = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;

    const order = await Order.findOne({
      "paymentDetails.orderId": razorpay_order_id,
    });

    if (!order) throw new Error("Order not found...");

    order.paymentStatus = "failed";

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order marked as payment failed...",
      order,
    });
  } catch (error) {
    console.error("ERROR :: in paymentFailed controller :: ", error);
    return res.status(500).json({
      success: false,
      messgae: "Error while updating order payment status to failed...",
      error:
        error.message ||
        "Something went wrong while updating payment status to failed",
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const { _id: userId } = req.user;

    if (!userId) throw new Error("Unauthorized...");

    const order = await Order.find({ user: userId }).sort({ createdAt: -1 });

    if (!order) throw new Error("Order not found...");

    return res.status(200).json({
      success: true,
      message: "User orders fetched successfully...",
      order,
    });
  } catch (error) {
    console.error("ERROR :: in getMyOrders controller :: ", error);
    return res.status(500).json({
      success: false,
      messgae: "Error while fetching user orders...",
      error: error.message || "Something went wrong while fetching user orders",
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const user = req.user;

    if (!orderId) throw new Error("Order ID is missing...");
    if (!user) throw new Error("Unauthorized...");

    const order = await Order.findOne({
      _id: orderId,
    }).populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found...",
        error: "Order not found...",
      });
    }

    if (!(order?.user?._id.toString() === user?._id.toString())) {
      if (!["admin", "superadmin"].includes(user?.role)) {
        return res.status(403).json({
          success: false,
          message: "Access Denied...",
          error: "Access Denied...",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully...",
      order,
    });
  } catch (error) {
    console.error("ERROR :: in getOrderById controller :: ", error);
    return res.status(500).json({
      success: false,
      messgae: "Error while fetching order...",
      error: error.message || "Something went wrong while fetching order",
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = limit * (page - 1);

    const filters = {};

    if (req.query.status) {
      filters.status = req.query.status;
    }

    if (req.query.startDate && req.query.endDate) {
      filters.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    const sort = req.query.sort || "-createdAt";

    const orders = await Order.find(filters)
      .populate("user", "email name")
      .populate("orderItems.product", "name price")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    console.log("orders :: ", orders);

    const totalOrders = await Order.countDocuments(filters);

    return res.status(200).json({
      success: true,
      message: "All orders fetched successfully...",
      totalOrders,
      page,
      totalPages: Math.ceil(totalOrders / limit),
      orders,
    });
  } catch (error) {
    console.error("ERROR :: in getAllOrders controller :: ", error);
    return res.status(500).json({
      success: false,
      messgae: "Error while fetching all orders...",
      error: error.message || "Something went wrong while fetching all orders",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) throw new Error("Order ID is missing...");

    const { status } = req.body;

    const enumStatuss = [
      "pending",
      "processing",
      "confirmed",
      "shipped",
      "delivered",
    ];

    if (!enumStatuss.includes(status)) throw new Error("Invalid status...");

    const order = await Order.findById(orderId);

    if (!order) throw new Error("Order not found...");

    order.status = status;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully...",
      order,
    });
  } catch (error) {
    console.error("ERROR :: in updateOrderStatus controller :: ", error);
    return res.status(500).json({
      success: false,
      messgae: "Error while updating order status...",
      error:
        error.message || "Something went wrong while updating order status",
    });
  }
};

export default {
  createOnlineOrder,
  createCODOrder,
  verifyPayment,
  paymentFailed,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
