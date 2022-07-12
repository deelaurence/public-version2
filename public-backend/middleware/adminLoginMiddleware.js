const jwt = require("jsonwebtoken");
const { adminSchema } = require("../models/adminModel");

// this middleware checks if you're logged in

const check = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const verifyToken = jwt.verify(token, process.env.jwtkeyy);
      //transfer verifyToken to the next function by binding the value to req object
      req.decoded = verifyToken;
      if (verifyToken) {
        const admin = await adminSchema.findOne({
          nameDB: verifyToken.name,
        });
        console.log(verifyToken);
        if (admin) {
          next();
        } else {
          return res.send("please login to access this route");
        }
      } else {
        res.send("token not verified");
      }
    } else {
      res.send("provide authorization key");
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { check };
