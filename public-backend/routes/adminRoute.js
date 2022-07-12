const express = require("express");
const router = express.Router();
const { register, login } = require("../controller/adminController");

const { check } = require("../middleware/adminLoginMiddleware");

router.post("/admin/register", register);

router.post("/admin/login", login);

module.exports = router;
