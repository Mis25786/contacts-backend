const mongoose = require("mongoose");

const app = require("./app");

const DB_HOST =
  "mongodb+srv://Misha:8cBjsbWdlULUOyMv@cluster0.bjulq21.mongodb.net/contacts_book?retryWrites=true&w=majority";

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
