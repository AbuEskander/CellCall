import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import mongooseEncryption from "mongoose-encryption";
import bcrypt from "bcrypt";
import expressSession from "express-session";

mongoose.connect("mongodb://127.0.0.1:27017/cellcall");

const app = express();
const port = 3000;
const saltRounds = 10;
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));
app.use(
  expressSession({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: Date,
});
const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  posts: Array,
});

const secret = process.env.SECRET;
userSchema.plugin(mongooseEncryption, {
  secret: secret,
  encryptedFields: ["password"],
});

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => {
  res.render("welcome.ejs");
});
app.get("/register", (req, res) => {
  res.render("register.ejs");
});
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/home", (req, res) => {
  res.render("home.ejs");
});

app.post("/register", async (req, res) => {
  try {
    const exist = await User.findOne({ email: req.body.email });
    if (!exist) {
      const hashed = await bcrypt.hash(req.body.password, saltRounds);
      const newUSER = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashed,
      });
      newUSER.save();
      res.redirect("/home");
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
  }
});
app.post("/login", async (req, res) => {
  try {
    const exist = await User.findOne({ email: req.body.email });
    if (exist) {
      bcrypt.compare(req.body.password, exist.password, (err, match) => {
        if (match) {
          res.redirect("/home");
          console.log("password is correct");
        } else {
          res.redirect("/login");
          console.log("password is incorrect");
        }
      });
    }else{
      res.redirect("/register");
      console.log("email is incorrect");
    }
  } catch (err) {
    console.log(err);
  }
});
app.listen(port, (err) =>
  err ? console.log(err) : console.log(`Server is running on port ${port}`)
);
