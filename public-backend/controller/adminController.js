const { adminSchema } = require("../models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//REGISTER NEW ADMIN
const register = async (req, res) => {
  try {
    const {
      nameFromAdmin,
      emailFromAdmin,
      passwordFromAdmin,
      adminRole,
      keyFromAdmin,
    } = req.body;

    // validating user inputs
    if (
      !(emailFromAdmin && passwordFromAdmin && nameFromAdmin && keyFromAdmin)
    ) {
      return res.status(400).send("All input is required");
    }
    if (keyFromAdmin !== process.env.adminkey) {
      return res.status(400).send("invalid admin key, please register as user");
    }
    // if admin exists already
    const oldAdmin = await adminSchema.findOne({ emailDB: emailFromAdmin });
    if (oldAdmin) {
      return res.status(409).send("admin already exists, please Login instead");
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(passwordFromAdmin, salt);

    const newAdmin = new adminSchema({
      nameDB: nameFromAdmin,
      emailDB: emailFromAdmin,
      passwordDB: hashedPassword,
      roleDB: adminRole,
    });

    await newAdmin.save();

    //Generating Token
    const token = jwt.sign(
      { name: newAdmin.nameDB, adminId: newAdmin._id },
      process.env.jwtkeyy
    );
    newAdmin.tokenDB = token;
    console.log(token);

    res.status(201).json({
      status: "Admin registered successfully to database",
      details: newAdmin,
    });
  } catch (error) {
    res.send(error);
  }
};

//ADMIN-LOGIN FUNCTION
const login = async (req, res) => {
  try {
    const { emailFromAdmin, passwordFromAdmin } = req.body;
    const admin = await adminSchema.findOne({ emailDB: emailFromAdmin });
    //Comparing the Database stored password and the just-inputed password

    if (!admin) return res.status(404).send("admin does not exist");
    const verifyCredentials = bcrypt.compareSync(
      passwordFromAdmin,
      admin.passwordDB
    );
    if (verifyCredentials) {
      const findAdmin = await adminSchema.findOne({ emailDB: emailFromAdmin });

      const token = jwt.sign(
        { name: findAdmin.nameDB, adminId: findAdmin._id },
        process.env.jwtkeyy
      );
      let addToken = await adminSchema.findOneAndUpdate(
        { emailDB: emailFromAdmin },
        { tokenDB: token, loggedIn: true },
        { new: true }
      );

      res.send(addToken);
    } else {
      res.send("wrong username or password");
    }
  } catch (error) {
    res.send(error);
  }
};

module.exports = { register, login };
