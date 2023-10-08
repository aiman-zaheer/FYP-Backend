const authRoutes = require("./authentication/authRoutes.js");
const customerRoutes = require("./customers/customerRoutes.js");
const tailorRoutes = require("./tailorRoutes/tailorRoutes.js");

const routes = (app) => {
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/customer", customerRoutes);
  app.use("/api/v1/tailor", tailorRoutes);
};
module.exports = routes;
