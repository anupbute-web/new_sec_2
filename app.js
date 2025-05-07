const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require('express-session');

const ejs = require("ejs");
const bcrypt = require("bcrypt");
const path = require("path");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(
    session({
      secret: 'your-secret-key', 
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false, 
        maxAge: 60 * 60
      },
    })
  );
app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
});

mongoose.pluralize(null);
mongoose.connect("mongodb://localhost:27017/new_sec_2");

let user = mongoose.Schema({
    username: String,
    email: String,
    pass: String
});

let sec = mongoose.Schema({
    sec: String,
    email: String
});

let new_user = mongoose.model("User", user);
let new_sec = mongoose.model("Sec", sec);

app.get("/", (req, res) => {
    res.render("intro");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    const { email, pass } = req.body;
    const user = await new_user.findOne({ email });
  
    if (!user || !(await bcrypt.compare(pass, user.pass))) {
      return res.render("login", { error: "Invalid credentials" });
    }
  
    req.session.user = { email: user.email, username: user.username };
    res.redirect(`/home/${user.email}`);
  });
  

app.get("/reg", (req, res) => {
    res.render("reg");
});

app.post("/reg", async (req, res) => {
    let { username, email, pass, cnfpass } = req.body;
    let salt=await bcrypt.genSalt(10);
    let hash=await bcrypt.hash(pass,salt);
    let ak = await new_user.create({ username, email, pass: hash });
    let bk = await new_sec.create({ sec: "null", email });
    res.redirect("/login")
});

app.get("/sec/:mail", (req, res) => {
    let mail = req.params.mail;
    res.render("sec", { mail })
});

app.post("/sec/:mail", async (req, res) => {
    let mail = req.params.mail;
    let ak = await new_sec.findOneAndUpdate({ email: mail }, { sec: req.body.sec });
    res.redirect(`/home/${mail}`)
});

app.get("/home/:mail", (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    next();
  }, async (req, res) => {
    const { mail } = req.params;
    const sec = await new_sec.findOne({ email: mail });
    res.render("home", { sec });
  });
  
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Failed to log out");
      }
      res.redirect("/login");
    });
  });
  

app.listen(4040)