const express = require("express");
const app = express();
const fs = require("fs").promises;
const cors = require("cors");
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
// for serving the static file
app.use("/uploads", express.static("uploads"));
const dotenv = require("dotenv");
dotenv.config();
// database connection
const dbconnection = require("./config/config.js");

const userRoute = require("./routes/userRoute.js");
const userQuestionRoute = require("./routes/userQuestionRoute.js");
const adminQuestionRoute = require("./routes/adminQuestionRoute.js");
const chatRoute = require("./routes/chatRoute.js")

app.use("/api", userRoute);
app.use("/api/user", userQuestionRoute);
app.use("/api/admin", adminQuestionRoute);
app.use("/api/chat", chatRoute);

app.listen(PORT, () => {
  console.log(`Server start at ${PORT}`);
});
