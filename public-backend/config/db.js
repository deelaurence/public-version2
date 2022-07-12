const mongoose = require("mongoose");
require("dotenv").config();

const mongoDB = process.env.ATLAS_URI;
//when testing with local compass
// const mongoDB = "mongodb://localhost:27017";

const connectDB = mongoose
  .connect(mongoDB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: true,
  })
  .then(() => console.log("Connected to Database"))
  .catch((error) => {
    error.statusCode = 400;
    console.error({
      status: "db connection failed",
      message: {
        error: error.message,
        name: error.name,
        statusCode: error.statusCode,
        code: error.code,
        syscall: error.syscall,
        hostname: error.hostname,
      },
    });
  });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = connectDB;
