const dotenv = require("dotenv");

dotenv.config();
console.log("PORT from env:", process.env.PORT);
module.exports = {
  PORT: process.env.PORT || 3000,
};
