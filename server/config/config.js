const mongoose = require("mongoose");
const DB = process.env.MONGODB;
mongoose
  .connect(DB, {})
  .then(() => {
    console.log("Data base connected MD");
  })
  .catch((err) => {
    console.log("error from db" + err);
  });
