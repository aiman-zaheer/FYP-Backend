const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//CORS Options
const corsOptions = {
  origin: "http://localhost:3001", // Replace with the origin of your client application
  methods: ["GET", "POST", "UPDATE", "DELETE"], // Specify the allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Specify the allowed headers
};

const externalSettings = (app) => {
  //3rd Party Middlewares
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cors(corsOptions));
};

module.exports = externalSettings;
