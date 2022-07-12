const { userSchema } = require("../models/userModel");
const { cartSchema } = require("../models/cartModel");
const { itemSchema } = require("../models/itemModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

//  VIEW CART
const all = async (req, res) => {
  const owner = req.params.ownerid;
  try {
    const cart = await cartSchema.findOne({ owner: owner });
    if (cart) {
      console.log(cart);
      res.send(cart);
    } else {
      res.send("Cart is empty");
    }
  } catch (err) {
    console.log(err);
  }
};

// ADD TO CART
const add = async (req, res) => {
  const owner = req.params.ownerid;
  const ownerFromToken = req.decoded.userID;
  console.log(`owner from req.param ${owner}`);
  console.log(`owner from token is ${ownerFromToken}`);
  const { productId, quantity } = req.body;
  try {
    const cart = await cartSchema.findOne({ owner });
    const item = await itemSchema.findOne({ _id: productId });
    if (!item) {
      res.status(404).send({ message: "item not found" });
      return;
    }
    const price = item.priceDB;
    const name = item.nameDB;
    //If cart already exists for user,
    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.itemId == productId
      );
      //check if product exists or not

      if (itemIndex > -1) {
        let product = cart.items[itemIndex];
        product.quantity = quantity;
        product.total = parseInt(quantity * price);
        cart.bill = parseInt(
          cart.items.reduce((acc, curr) => {
            return acc + curr.quantity * curr.price;
          }, 0)
        );
        cart.items[itemIndex] = product;
        await cart.save();
        res.status(200).send(cart);
      } else {
        cart.items.push({
          itemId: productId,
          name,
          quantity: quantity,
          price,
          total: parseInt(price * quantity).toFixed(2),
        });
        cart.bill = parseInt(
          cart.items.reduce((acc, curr) => {
            return acc + curr.quantity * curr.price;
          }, 0)
        );

        await cart.save();
        res.status(200).send(cart);
      }
    } else {
      //no cart exists, create one
      const newCart = await cartSchema.create({
        owner,
        items: [
          {
            itemId: productId,
            name,
            quantity: quantity,
            price,
            total: parseInt(price * quantity),
          },
        ],
        bill: parseInt(quantity * price),
      });
      return res.status(201).send(newCart);
    }
  } catch (err) {
    console.log(err);
  }
};

// DELETE ITEMS IN CART
const remove = async (req, res) => {
  const owner = req.params.ownerid;
  const { itemId } = req.body;
  try {
    let cart = await cartSchema.findOne({ owner: owner });
    const itemIndex = cart.items.findIndex((item) => item.itemId == itemId);

    if (itemIndex > -1) {
      let item = cart.items[itemIndex];
      cart.bill -= item.quantity * item.price;

      if (cart.bill < 0) {
        cart.bill = 0;
      }
      cart.items.splice(itemIndex, 1);
      cart.bill = cart.items.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
      }, 0);

      cart = await cart.save();

      res.send(cart);
    } else {
      res.send("Item not found");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { all, add, remove };
