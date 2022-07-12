const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const admin = new mongoose.Schema(
  {
    nameDB: {
      type: String,
      required: true,
      uppercase: true,
      minLength: 5,
      maxLength: 15,
    },

    emailDB: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },

    passwordDB: {
      type: String,
      required: true,
      min: 8,
    },

    tokenDB: {
      type: String,
      default: "token not yet provided",
    },

    loggedIn: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const adminSchema = mongoose.model("admins", admin);

module.exports = { adminSchema };
