const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();
const port = process.env.PORT || 5000;
const mongoUri =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mern_practical";

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.post("/api/payment", (req, res) => {
  const amount = Number(req.body.amount);

  if (Number.isFinite(amount) && amount > 0) {
    return res.json({ status: "success", amount });
  }

  return res.status(400).json({
    status: "failed",
    message: "Payment amount must be greater than 0.",
  });
});

app.use((err, req, res, next) => {
  if (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }

  return next();
});

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
