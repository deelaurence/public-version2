const express = require("express");
const router = express.Router();
const { register, login } = require("../controller/adminController");

const { check } = require("../middleware/adminLoginMiddleware");

router.post("/register", register);

router.post("/login", login);

module.exports = router;
