import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is missing"],
      index: true,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is missing"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is missing"],
          validate: {
            validator: Number.isInteger,
            message: "Quantity must be an integer value",
          },
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: [true, "Price is missing"],
          min: [0, "Price must be positive number"],
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: [true, "Total price is missing"],
    },
    status: {
      type: String,
      required: [true, "Order status is missing"],
      enum: ["pending", "confirmed", "shipped", "delivered"],
      default: "pending",
    },
    shippingAddress: {
      street: {
        type: String,
        required: [true, "Street in shipping address is missing"],
      },
      city: {
        type: String,
        required: [true, "City in shipping address is missing"],
      },
      state: {
        type: String,
        required: [true, "State in shipping address is missing"],
      },
      country: {
        type: String,
        required: [true, "Country in shipping address is missing"],
      },
      pincode: {
        type: String,
        required: [true, "Pin code in shipping address is missing"],
      },
    },
    paymentStatus: {
      type: String,
      required: [true, "Payment status is missing"],
      enum: ["pending", "paid"],
      default: "pending",
    },
    paymentDetails: {
      orderId: String,
      paymentId: String,
      signature: String,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
