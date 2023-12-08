import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";

mongoose.connect("mongodb://127.0.0.1:27017/cellcall");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: Date,
});
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  posts: [postSchema],
});

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);

let basil = new User({
  name: "Basil",
  email: "HEhe",
  password: "1234",
  Date: Date.now(),
});

app.get("/", (req, res) => {
  res.render("register.ejs");
});

// let ahmed = await User.findOne({ name: "Basil" }).exec();

// console.log(ahmed.posts);

app.listen(port, (err) =>
  err ? console.log(err) : console.log(`Server is running on port ${port}`)
);
