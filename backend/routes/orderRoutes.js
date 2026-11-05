const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const { createOrder, getOrders, myOrders, updateOrderStatus} = require("../controller/orderController.js");


const router = express.Router();


// Create a new order
router.post("/", protect, createOrder);
router.get("/", protect, admin, getOrders);
router.get("/myorders", protect, myOrders);

router.put("/:id/status", protect, admin, updateOrderStatus);




module.exports = router;