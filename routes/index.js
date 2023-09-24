const authRoutes = require("./authentication/authRoutes.js");
const routes = (app) => {
  app.use("/api/v1/auth", authRoutes);
};
module.exports = routes;
