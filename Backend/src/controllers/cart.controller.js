import { validationResult } from "express-validator";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

const addToCart = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid data...",
        error: errors.array(),
      });
    }

    const { productId, quantity } = req.body;

    const userId = req.user?._id;

    if (!userId) throw new Error("Unauthorized...");

    if (!productId || !quantity) {
      throw new Error("All fields are required...");
    }

    const product = await Product.findById(productId);

    if (!product) throw new Error("Product not found...");

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    return res.status(201).json({
      success: true,
      messaage: "Item added to cart successfully...",
      cart: cart,
    });
  } catch (error) {
    console.error("ERROR :: in addToCart controller :: ", error);
    return res.status(500).json({
      success: false,
      message: "Error while adding item to cart...",
      error: error.messaage || "Something went wrong while adding item to cart",
    });
  }
};

const updateCart = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid data...",
        error: errors.array(),
      });
    }

    const { quantity } = req.body;
    const { productId } = req.params;
    const userId = req.user?._id;

    if (!userId) throw new Error("Unauthorized...");

    if (!productId) throw new Error("Product ID is missing...");

    if (!quantity || isNaN(quantity) || quantity < 0) {
      throw new Error("Quantity must be positive integer...");
    }

    const product = await Product.findById(productId);

    if (!product) throw new Error("Product not found...");

    let cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error("Cart not found for user...");

    const itemInCart = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!itemInCart) throw new Error("Item does not exist in cart...");

    if (quantity === 0) {
      cart.items.filter((item) => item.product.toString() !== productId);
    } else {
      itemInCart.quantity = quantity;
    }

    await cart.save();

    return res.status(201).json({
      success: true,
      messaage: "Cart updated successfully...",
      cart: cart,
    });
  } catch (error) {
    console.error("ERROR :: in updateCart controller :: ", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating cart...",
      error: error.messaage || "Something went wrong while updating cart",
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    const productId = req.params?.productId;

    if (!userId) throw new Error("Unauthorized...");

    if (!productId) throw new Error("Product ID is missing...");

    const cart = await Cart.findOne({ user: userId });

    if (!cart) throw new Error("Cart not found for user...");

    const isExistInCart = cart.items.some(
      (item) => item.product.toString() === productId
    );

    if (!isExistInCart) throw new Error("Product does not exist in cart...");

    const items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    cart.items = items;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item removed from cart successfully...",
      cart: cart,
    });
  } catch (error) {
    console.error("ERROR :: in removeFromCart controller :: ", error);
    return res.status(500).json({
      success: false,
      message: "Error while removing the item from cart...",
      error:
        error.message ||
        "Something went wrong while removing the item from cart",
    });
  }
};
const getCart = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) throw new Error("Unauthorized...");

    const cart = await Cart.findOne({ user: userId });

    return res.status(200).json({
      success: true,
      message: "Cart data fetched successfully...",
      cart: cart,
    });
  } catch (error) {
    console.error("ERROR :: in getCart controller :: ", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching cart...",
      error: error.messaage || "Something went wrong while fetching cart data",
    });
  }
};

export default { addToCart, updateCart, removeFromCart, getCart };
