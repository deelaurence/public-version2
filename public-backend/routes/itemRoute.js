const express = require("express");
const router = express.Router();
const {
  create,
  edit,
  deleteOne,
  getAllItems,
  getOneItem,
  sortItem,
  getCategory,
  getCategoryAndSort,
} = require("../controller/itemController");
const { check } = require("../middleware/adminLoginMiddleware");
//only admins can create, edit and delete
router.post("/product/new", check, create);
router.put("/product/edit/:id", check, edit);
router.delete("/product/delete/:id", check, deleteOne);
//any user can perform these actions
router.get("/item/:id", getOneItem);
router.get("/items", getAllItems);
router.get("/itemsort", sortItem);
router.get("/items/category/:categ", getCategory);
router.get("/items/categorysort/:categ", getCategoryAndSort);

module.exports = router;
