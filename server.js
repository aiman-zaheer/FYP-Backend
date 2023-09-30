const connection = require("./config/database.config.js");
const app = require("./app.js");
// Define environment variables
const dotenv = require("dotenv");
dotenv.config();

//accessig environment variable
const API_PORT = process.env.API_PORT;
const PORT = API_PORT || 4000;

//connecting database
connection();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
