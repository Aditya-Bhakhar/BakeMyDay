import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      minLength: [2, "Product name must be atleast 2 characters long..."],
      index: true,
      required: [true, "Product name is required"],
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      minLength: [6, "Product name must be atleast 6 characters long..."],
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      lowercase: true,
      index: true,
      enum: ["cheesecake", "cake", "cookie", "pastry", "brownie", "other"],
      required: true,
    },
    price: {
      type: Number,
      min: [0, "Price must be greater than 0"],
      index: true,
      required: [true, "Price is required"],
    },
    productImage: {
      type: String,
      required: [true, "Product image is required"],
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
