// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const session = require("express-session");

// const ejs = require("ejs");
// const bcrypt = require("bcrypt");
// const path = require("path");
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));
// app.set("view engine", "ejs");
// app.use(
//   session({
//     secret: "your-secret-key",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true,
//       secure: false,
//       maxAge: 60 * 60,
//     },
//   })
// );
// app.use((req, res, next) => {
//   res.setHeader(
//     "Cache-Control",
//     "no-store, no-cache, must-revalidate, private"
//   );
//   res.setHeader("Pragma", "no-cache");
//   res.setHeader("Expires", "0");
//   next();
// });
// mongoose.pluralize(null);
// mongoose.connect(
//   "mongodb+srv://anupbute:anupbute1@secrets.2pflmb5.mongodb.net/?retryWrites=true&w=majority&appName=secrets2"
// );

// let user = mongoose.Schema({
//   username: String,
//   email: String,
//   pass: String,
// });

// let sec = mongoose.Schema({
//   sec: String,
//   email: String,
// });

// let new_user = mongoose.model("User", user);
// let new_sec = mongoose.model("Sec", sec);

// app.get("/", (req, res) => {
//   res.render("intro");
// });

// app.get("/login", (req, res) => {
//   res.render("login");
// });  

// app.post("/login", async (req, res) => {
//   const { email, pass } = req.body;
//   const user = await new_user.findOne({ email });

//   if (!user || !(await bcrypt.compare(pass, user.pass))) {
//     let how=1; 
//     return res.render("login", {how});
//   }

//   req.session.user = { email: user.email, username: user.username };
//   res.redirect(`/home/${user.email}`);
// });

// app.get("/reg", (req, res) => {
//   res.render("reg");
// });

// app.post("/reg", async (req, res) => {
//   let { username, email, pass, cnfpass } = req.body;
//   let salt = await bcrypt.genSalt(10);
//   let hash = await bcrypt.hash(pass, salt);
//   let ak = await new_user.create({ username, email, pass: hash });
//   let bk = await new_sec.create({ sec: "null", email });
//   res.redirect("/login");
// });

// app.post("/sec", (req, res) => {
//   let mail = req.body.sec_mail; 
//   console.log(mail)
//   res.render("sec", { mail });
// });

// app.post("/secs", async (req, res) => {
//   let mail = req.body.sec_mail;
//   let ak = await new_sec.findOneAndUpdate(
//     { email: mail },
//     { sec: req.body.sec }
//   );
//   res.redirect(`/home/${mail}`);
// });

// app.get(
// "/home/:mail",
//   (req, res, next) => {
//     if (!req.session.user) {
//       return res.redirect("/login");
//     }
//     next();
//   },
//   async (req, res) => {
//     const { mail } = req.params;
//     const sec = await new_sec.findOne({ email: mail });
//     res.render("home", { sec });
//   }
// );

// app.get("/logout", (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       return res.status(500).send("Failed to log out");
//     }
//     res.redirect("/login");
//   });
// });

// app.listen(4040);


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 1000, 
    },
  })
);

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// MongoDB connection
mongoose.pluralize(null);
mongoose.connect(
  "mongodb+srv://anupbute:anupbute1@secrets.2pflmb5.mongodb.net/?retryWrites=true&w=majority&appName=secrets2"
);

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  pass: String,
});

const secSchema = mongoose.Schema({
  sec: String,
  email: String,
});

const new_user = mongoose.model("User", userSchema);
const new_sec = mongoose.model("Sec", secSchema);


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
    return res.render("login", { how: 1 });
  }

  req.session.user = { email: user.email, username: user.username };
  res.redirect("/home");
});

app.get("/reg", (req, res) => {
  res.render("reg");
});

app.post("/reg", async (req, res) => {
  const { username, email, pass, cnfpass } = req.body;
  if (pass !== cnfpass) {
    return res.send("Passwords do not match.");
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(pass, salt);
  await new_user.create({ username, email, pass: hash });
  await new_sec.create({ sec: "null", email });
  res.redirect("/login");
});

app.post("/sec", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  const mail = req.session.user.email;
  res.render("sec", { mail });
});

app.post("/secs", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  const mail = req.session.user.email;
  await new_sec.findOneAndUpdate({ email: mail }, { sec: req.body.sec });
  res.redirect("/home");
});

app.get(
  "/home",
  (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    next();
  },
  async (req, res) => {
    const email = req.session.user.email;
    const sec = await new_sec.findOne({ email });
    res.render("home", { sec });
  }
);

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Failed to log out");
    res.redirect("/login");
  });
});

app.listen(4040, () => {
  console.log("Server running on http://localhost:4040");
});
