const { itemSchema } = require("../models/itemModel");
const { adminSchema } = require("../models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Create An Item
const create = async (req, res) => {
  const verifyToken = req.decoded;
  console.log(verifyToken);
  const owner = await adminSchema.findOne({ nameDB: verifyToken.name });
  try {
    const {
      nameOfItem,
      descriptionOfItem,
      imageOfItem,
      categoryOfItem,
      priceOfItem,
      quantityOfItem,
    } = req.body;

    console.log(owner);
    const newItem = new itemSchema({
      ownerDB: owner.nameDB,
      nameDB: nameOfItem,
      descriptionDB: descriptionOfItem,
      imageDB: imageOfItem,
      categoryDB: categoryOfItem,
      priceDB: priceOfItem,
      quantityDB: quantityOfItem,
    });
    // console.log(newItem);

    const checkForExisting = await itemSchema.findOne({
      nameDB: nameOfItem,
    });
    if (checkForExisting) {
      res.status(200).json({
        message: "item already exists, update instead",
      });
    } else {
      await newItem.save();
      res.status(201).json({
        status: "Item successfully added to database",
        details: newItem,
      });
    }
  } catch (error) {
    res.send(error);
  }
};

const edit = async (req, res) => {
  try {
    const {
      nameOfItem,
      descriptionOfItem,
      imageOfItem,
      categoryOfItem,
      quantityOfItem,
      priceOfItem,
    } = req.body;
    const item = await itemSchema.findOne({ _id: req.params.id });
    //req.decoded was passed to this function from the admin
    //middleware it holds the value for the decoded jwt sent from
    //the frontend
    console.log(item);
    console.log(req.decoded.name);
    if (!item) {
      return res.status(404).send("item not found");
    } else {
      if (req.decoded.name == item.ownerDB) {
        (item.nameDB = nameOfItem),
          (item.descriptionDB = descriptionOfItem),
          (item.imageDB = imageOfItem),
          (item.categoryDB = categoryOfItem),
          (item.quantityDB = quantityOfItem),
          (item.priceDB = priceOfItem);

        await item.save();

        res.status(202).json({ message: "item edited", item });
      } else {
        res.json({
          message: "item can only be edited by owner",
          itemOwner: item.ownerDB,
        });
      }
    }
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

const deleteOne = async (req, res) => {
  try {
    const item = await itemSchema.findById(req.params.id);
    //req.decoded was passed to this function from the admin
    //middleware it holds the value for the decoded jwt sent from
    //the frontend
    console.log(item);
    console.log(req.decoded.name);
    if (!item) {
      return res.status(404).send("item not found");
    } else {
      if (req.decoded.name == item.ownerDB) {
        await item.delete();
        res.json({ message: "item deleted", item });
      } else {
        res.status(401).json({
          message: "item can only be deleted by owner",
          itemOwner: item.ownerDB,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const getAllItems = async (req, res) => {
  try {
    const allItems = await itemSchema.find({});
    if (!allItems) {
      res.status(200).send("no items");
    } else {
      res.json({ allItems });
    }
  } catch (error) {
    res.send(error);
  }
};

const getOneItem = async (req, res) => {
  try {
    const item = await itemSchema.findById(req.params.id);
    //req.decoded was passed to this function from the admin
    //middleware it holds the value for the decoded jwt sent from
    //the frontend
    if (!item) {
      return res.send("item not found");
    } else {
      res.status(200).send(item);
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
//to sort by any parameter e.g by price
//http://localhost:3000/itemsort/?priceDB=-1 descenging order
//http://localhost:3000/itemsort/?priceDB=1 ascending order
//sort by quantity
//http://localhost:3000/itemsort/?quantityDB=1 ascending order

const sortItem = async (req, res) => {
  try {
    const sorted = await itemSchema.find({}).sort(req.query);
    console.log(req.query);
    res.status(200).json({ sorted });
  } catch (error) {
    res.send(error);
  }
};

// get only items in a particular category
// GET http://localhost:3000/items/category/pant

const getCategory = async (req, res) => {
  try {
    const category = await itemSchema.find({ categoryDB: req.params.categ });
    res.status(200).json({ category });
  } catch (error) {
    res.send(error);
  }
};

//get all items in a category then sort according to price
//GET http://localhost:3000/items/categorysort/hats/?priceDB=1

const getCategoryAndSort = async (req, res) => {
  try {
    const categoryAndSort = await itemSchema
      .find({ categoryDB: req.params.categ })
      .sort(req.query);
    res.status(200).json({ categoryAndSort });
  } catch (error) {
    res.send(error);
  }
};
module.exports = {
  create,
  edit,
  deleteOne,
  getAllItems,
  getOneItem,
  sortItem,
  getCategory,
  getCategoryAndSort,
};
