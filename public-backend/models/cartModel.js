const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcrypt');
const itemSchema = require('./itemModel');
const userSchema = require('./userModel');

const ObjectID = mongoose.Schema.Types.ObjectId;

const cart = new mongoose.Schema({
    owner: {
        type: ObjectID,
        ref: 'users'
    },

    items: [{
        itemId: {
            type: ObjectID,
            ref: 'Items'
        },
        name: {
            type: String,
            ref: 'Items'
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        price: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true,
            default: 0
        }
    }],

    bill: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true
});

const cartSchema = mongoose.model("carts", cart);

module.exports = { cartSchema };