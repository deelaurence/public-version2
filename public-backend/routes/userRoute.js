const express = require("express");
const { check } = require("../middleware/userLoginMiddleware");
const { all, add, remove } = require("../controller/addToCartController")
const router = express.Router();

const {
  register,
  login,
  general,
  restricted,
  logout,
  verifyMail,
} = require("../controller/userController");
router.get("/confirm/:token", verifyMail);
router.post("/register", register);

router.post("/login", login);
router.post("/:ownerid/additem", check, add);
router.get("/:ownerid/cart", check, all);
router.delete("/:ownerid/cart/remove", check, remove);

router.get("/general", general);
router.get("/restricted", check, restricted);
router.post("/logout", check, logout);

module.exports = router;
