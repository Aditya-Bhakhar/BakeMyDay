import { validationResult } from "express-validator";
import { Product } from "../models/product.model.js";
import {
  deleteFromCloudinary,
  replaceImage,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { extractPublicId } from "../utils/helper.js";
import ApiFeatures from "../utils/ApiFeatures.js";

const addProduct = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
        error: errors.array(),
      });
    }

    const { name, description, category, price } = req.body;

    if (!name || !description || !category || !price || !req.file) {
      throw new Error("All fields are required...");
    }

    let productImage;

    if (req.file) {
      productImage = await uploadOnCloudinary(
        req.file?.buffer,
        "BakeMyDay/Product Images"
      );

      if (!productImage) {
        throw new Error(
          "Error while uploading the product image on cloudinary..."
        );
      }
    }

    const createdProduct = await Product.create({
      name,
      description,
      price,
      category,
      productImage: productImage?.secure_url,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully...",
      product: createdProduct,
    });
  } catch (error) {
    console.error("ERROR :: Error in addProduct controller :: ", error);
    return res.status(500).json({
      success: false,
      message: "Error while adding product...",
      error: error.message || "Something went wrong while adding product",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid Data",
        error: errors.array(),
      });
    }

    const { name, description, category, price } = req.body;

    const productId = req.params?.productId;

    if (!productId) {
      throw new Error("Product Id is missing...");
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("Prodct you want to update is not found...");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: { name, description, category, price } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully...",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("ERROR :: Error in updateProduct controller :: ", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating product...",
      error: error.message || "Something went wrong while updating product",
    });
  }
};

const updatedProductImage = async (req, res) => {
  try {
    const productId = req.params?.productId;

    console.log("productId :: ", productId);
    console.log("req.file :: ", req.file);

    if (!productId) {
      throw new Error("Product Id is missing...");
    }

    if (!req.file) {
      throw new Error("Image file is missing...");
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("Prodct you want to update image of is not found...");
    }

    // const productImage = await uploadOnCloudinary(
    //     req.file?.buffer,
    //     "BakeMyDay/Product Images"
    // );

    console.log(product?.productImage);

    const oldPublicId = extractPublicId(product?.productImage);

    console.log({ oldPublicId });

    if (!oldPublicId) {
      throw new Error(
        "Error while extracting the public id of product image..."
      );
    }

    const productImage = await replaceImage(
      oldPublicId,
      req.file?.buffer,
      "BakeMyDay/Product Images"
    );

    if (!productImage) {
      throw new Error(
        "Error while uploading the product image to cloudinary..."
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: { productImage: productImage?.secure_url } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Product image updated successfully...",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(
      "ERROR :: Error in updatedProductImage controller :: ",
      error
    );
    return res.status(500).json({
      success: false,
      message: "Error while updating product image...",
      error:
        error.message || "Something went wrong while updating product image",
    });
  }
};

const removeProduct = async (req, res) => {
  try {
    const productId = req.params?.productId;

    if (!productId) {
      throw new Error("Product Id is missing...");
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("Prodct you want to remove is not found...");
    }

    const publicId = await extractPublicId(product?.productImage);

    if (!publicId) {
      throw new Error(
        "Error while extracting the public id of product image..."
      );
    }

    await deleteFromCloudinary(publicId);

    const removedProduct = await Product.findByIdAndDelete(productId);

    return res.status(200).json({
      success: true,
      message: "Product removed successfully...",
      product: removedProduct,
    });
  } catch (error) {
    console.error("ERROR :: Error in removeProduct controller :: ", error);
    return res.status(500).json({
      success: false,
      message: "Error while removing product...",
      error: error.message || "Something went wrong while removing product",
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    // const queryParams = req.query;
    const resultPerPage = req.query.limit || 10;
    const page = req.query.page || 1;
    const productsCount = await Product.countDocuments();

    const apiFeatures = new ApiFeatures(Product.find(), req.query)
      .search()
      .filter()
      .sort()
      .paginate(resultPerPage);

    const products = await apiFeatures.query;

    return res.status(200).json({
      success: true,
      message: "All products fetched successfully... ",
      page: page,
      totalPages: Math.ceil(productsCount / resultPerPage),
      limit: resultPerPage,
      count: products.length,
      totalProducts: productsCount,
      products: products,
    });
  } catch (error) {
    console.error("ERROR :: Error in getAllProducts controller :: ", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching all products...",
      error:
        error.message || "Something went wrong while fetching all products",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params?.productId;

    if (!productId) {
      throw new Error("Product Id missing...");
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("Product not found...");
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully...",
      product: product,
    });
  } catch (error) {
    console.error("ERROR :: Error in getProductById controller :: ", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching product...",
      error: error.message || "Something went wrong while fetching product",
    });
  }
};

export default {
  addProduct,
  updateProduct,
  updatedProductImage,
  removeProduct,
  getAllProducts,
  getProductById,
};
