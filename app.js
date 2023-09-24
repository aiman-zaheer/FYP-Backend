const express = require("express");
const connection = require("./config/database.config.js");
const routes = require("./routes/index.js");
const externalSettings = require("./config/middleWares.config.js");

//accessig environment variable
const API_PORT = process.env.API_PORT;
const PORT = API_PORT || 4000;
const app = express();

//connecting database
connection();

externalSettings(app);

//routes
routes(app);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
