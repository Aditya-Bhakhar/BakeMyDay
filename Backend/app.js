import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./src/routes/user.route.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ success: true });
});

app.use("/api/user", userRoutes)

export default app;
