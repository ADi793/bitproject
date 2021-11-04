const home = require("./routes/home");
const users = require("./routes/users");
const express = require("express");
const app = express();

// configuration
require("./config/db");
app.use(express.json());

// routes
app.use("/", home);
app.use("/api/users", users);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
