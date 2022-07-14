const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const itemRoute = require("./routes/itemRoute");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
//CONNECT TO DATABASE
connectDB;

//BODY PARSER
app.use(express.json());
app.use(express.static("public"));

//ROUTE
app.use("/user", userRoute);
app.use("/admin", adminRoute);
app.use("/i", itemRoute);

//test auth with frontend
const path = require("path");

app.get("/frontend", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/index.html"));
});
app.get("/welcome", (req, res) => [
  res.sendFile(path.resolve(__dirname, "./public/loggedin.html")),
]);

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`running server on port ${PORT}....`);
});
