const jwt = require("jsonwebtoken");
const { userSchema } = require("../models/userModel");
//a middleware that checks if users are logged in
const check = async (req, res, next) => {
  //logged in user should have authorization key in headers
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const verifyToken = jwt.verify(token, process.env.jwtkey);

      if (verifyToken) {
        const user = await userSchema.findOne({
          usernameDB: verifyToken.username,
        });
        console.log(verifyToken);
        if (user) {
          //pass verifyToken value to next function by adding to the req object
          req.decoded = verifyToken;
          next();
        } else {
          res.send("user not found");
        }
      } else {
        res.send("token not verified");
      }
    } else {
      res.send("provide authorization key");
    }
  } catch (err) {
    res.send(err);
  }
};

module.exports = { check };
