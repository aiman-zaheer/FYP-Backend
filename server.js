const connection = require("./config/database.config.js");
const app = require("./app.js");
// Define environment variables
const dotenv = require("dotenv");
dotenv.config();

//accessig environment variable
const API_PORT = process.env.API_PORT;
const port = API_PORT || 4000;

//connecting database
connection();

const server = app.listen(port, () =>
  console.log(`Server started listening on ${port}`)
);

process.on("unhandledRejection", (error, promise) => {
  console.log(`Logged Error: ${error}`);
  server.close(() => process.exit(1));
});
