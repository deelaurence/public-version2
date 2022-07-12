const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const ObjectID = mongoose.Schema.Types.ObjectId;

const item = new mongoose.Schema(
  {
    ownerDB: {
      type: String,
    },
    nameDB: {
      type: String,
      required: true,
      trim: true,
    },

    descriptionDB: {
      type: String,
      required: true,
    },
    imageDB: {
      type: String,
      required: true,
    },

    categoryDB: {
      type: String,
      required: true,
    },

    priceDB: {
      type: Number,
      required: true,
    },
    quantityDB: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const itemSchema = mongoose.model("Items", item);

module.exports = { itemSchema };
