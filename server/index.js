require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const authRouter = require("./router/auth");
const postRouter = require("./router/post");

const mongoose = require("mongoose");
mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.pwvor.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  (err) => {
    if (!err) console.log("db connected");
    else console.log("db error");
  }
);

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
