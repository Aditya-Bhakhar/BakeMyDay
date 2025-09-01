import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./src/routes/user.route.js";
import productRoutes from "./src/routes/product.route.js";
import cartRoutes from "./src/routes/cart.route.js";
import orderRoutes from "./src/routes/order.route.js";
import analyticsRoutes from "./src/routes/analytics.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json({ success: true });
});

app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/analytics", analyticsRoutes);

export default app;
