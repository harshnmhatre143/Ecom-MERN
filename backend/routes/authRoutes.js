const express = require("express");
const router = express.Router();
const { registerUser, getUsers , loginUser} = require("../controller/authController")
const {protect} = require("../middleware/authMiddleware")
const {admin} = require("../middleware/adminMiddleware")


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", protect ,admin, getUsers);// protect and admin are middleware


module.exports = router;