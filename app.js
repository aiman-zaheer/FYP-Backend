const express = require("express");
const routes = require("./routes/index.js");
const externalSettings = require("./config/middleWares.config.js");

const app = express();

//middleware
externalSettings(app);

//routes
routes(app);

module.exports = app;
