const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected to the database...");
  })
  .catch((err) => {
    console.log("Could not connect to the database.", err);
  });
