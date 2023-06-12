const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const app = require("./app");

const DB_HOST = process.env.DB_HOST;
// const { DB_HOST } = require("./config");
console.log(DB_HOST);

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });

// app.listen(3000, () => {
//   console.log("Server running. Use our API on port: 3000");
// });
