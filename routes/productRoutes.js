const express = require("express");
const multer = require("multer");
const path = require("path");
const { body, validationResult } = require("express-validator");

const Product = require("../models/Product");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueName}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
      return;
    }

    cb(new Error("Only image uploads are allowed"));
  },
});

router.post(
  "/",
  auth,
  upload.single("image"),
  [
    body("name").notEmpty().withMessage("Product name is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    try {
      const product = await Product.create({
        name: req.body.name,
        price: Number(req.body.price),
        image: req.file.path.replace(/\\/g, "/"),
        createdBy: req.user.id,
      });

      return res.status(201).json(product);
    } catch (error) {
      return res.status(500).json({ message: "Product creation failed", error: error.message });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch products", error: error.message });
  }
});

module.exports = router;
