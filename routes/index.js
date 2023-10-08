const authRoutes = require("./authentication/authRoutes.js");
const customerRoutes = require("./customers/customerRoutes.js");

const routes = (app) => {
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/customer", customerRoutes)
};
module.exports = routes;
