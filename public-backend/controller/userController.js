const { userSchema } = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const nodemailer = require("nodemailer");
const { sendConfirmation } = require("../nodemailerAuth");

//REGISTER FUNCTION THAT REGISTERS NEW USERS
const register = async (req, res) => {
  try {
    const {
      usernameFromUser,
      emailFromUser,
      passwordFromUser,
      phoneNumberFromUser,
      userRole,
    } = req.body;
    //validate user input
    if (!(emailFromUser && passwordFromUser && phoneNumberFromUser)) {
      return res.status(400).send("All input is required");
    }
    //check if user already exist in database
    const oldUser = await userSchema.findOne({ emailDB: emailFromUser });
    if (oldUser) {
      return res.status(409).send("user already exists, please Login instead");
    }
    //hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(passwordFromUser, salt);

    //SAVE THE USER CREDENTIALS TO DATABASE

    const newUser = new userSchema({
      usernameDB: usernameFromUser,
      emailDB: emailFromUser.toLowerCase(),
      phoneNumberDB: phoneNumberFromUser,
      passwordDB: hashedPassword,
      roleDB: userRole,
    });

    //generate token
    const token = jwt.sign(
      { username: newUser.usernameDB, userID: newUser._id },
      process.env.jwtkey
    );

    newUser.tokenDB = token;
    await newUser.save();

    res.status(201).json({
      status: "user registered successfully to database",
      message: "check your email for confirmation link",
      details: newUser,
    });
    sendConfirmation(usernameFromUser, emailFromUser, token);
  } catch (error) {
    console.log(error);
  }
};

//VERIFY MAIL

const verifyMail = async (req, res) => {
  try {
    const unconfirmedUser = await userSchema.findOne({
      token: req.params.token,
    });
    console.log(unconfirmedUser);
    if (!unconfirmedUser) {
      return res.status(404).send("user not found");
    }
    unconfirmedUser.emailConfirmation = true;
    await unconfirmedUser.save();
    res.send("email confirmed, proceed to login");
  } catch (error) {
    res.status(500).send(error);
  }
};

//LOGIN FUNCTION
const login = async (req, res) => {
  try {
    const { emailFromUser, passwordFromUser } = req.body;
    console.log(req.body);

    const user = await userSchema.findOne({ emailDB: emailFromUser });
    //TO LOGIN, USE BCRYPT TO COMPARE THE PASSWORD SUPPLIED BY USER TO THE PASSWORD
    //FETCHED FROM THE DATABASE
    if (!user) return res.status(400).send("user does not exist");
    const verifyCredentials = bcrypt.compareSync(
      passwordFromUser,
      user.passwordDB
    );
    if (user.emailConfirmation == false) {
      return res.status(500).send("please verify email");
    }
    if (verifyCredentials) {
      //jwt.sign is a method that encrypts data we want to trasfer and the signature(jwtkey)
      //jwtkey is a random string stored in .env
      const findUser = await userSchema.findOne({ emailDB: emailFromUser });
      const token = jwt.sign(
        { username: findUser.usernameDB, id: findUser._id },
        process.env.jwtkey
      );
      let addTokenToDB = await userSchema.findOneAndUpdate(
        { emailDB: emailFromUser },
        { tokenDB: token, loggedIn: true },
        { new: true }
      );

      res.status(201).json({ message: "logged in", userDetails: addTokenToDB });
    } else {
      res.send("wrong username or password");
    }
  } catch (error) {
    console.log(error);
  }
};
//THIS FUNCTION ACESSED BY EVERYBODY
const general = (req, res) => {
  res.send("general");
};

//THIS FUNCTION IS CALLED WHEN A GET REQUEST IS MADE TO THE /restricted ROUTE
//IT IS ONLY CALLED IF THE USER PASSES THE REQUIREMENTS IN THE check function
//IN THE authMiddleware FILE ONLY USERS WITH THE TOKEN SUPPLIED IN THEIR HEADER
//DURING REQUEST CAN ACCESS
const restricted = (req, res) => {
  console.log(req.headers.authorization);
  console.log(req.decoded);
  res.json(req.decoded);
};

const logout = async (req, res) => {
  const verifiedToken = req.decoded;
  console.log(verifiedToken);

  if (verifiedToken) {
    const user = await userSchema.findOneAndUpdate(
      { usernameDB: verifiedToken.username },
      { loggedIn: false, tokenDB: "" }
    );

    res.status(201).send(`${user.usernameDB} logged out`);
  }
};
module.exports = { register, login, general, restricted, logout, verifyMail };
