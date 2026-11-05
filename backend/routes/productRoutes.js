const express = require("express");

const { protect } = require("../middleware/authMiddleware")
const { admin } = require("../middleware/adminMiddleware")
const { getProducts, createProduct, getProductById, updateProduct, deleteProduct } = require("../controller/productController.js")
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files
const router = express.Router();


// All products
router.get("/", getProducts);
router.post("/", protect, admin, upload.single('image'), createProduct);

// Specific product
router.get("/:id", getProductById);
router.put("/:id", protect, admin, upload.single('image'), updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;