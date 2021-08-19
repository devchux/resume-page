const express = require("express");
const path = require("path");
const { config } = require("dotenv");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const sendMail = require("./utils/transporter.mail");

config();

const app = express();
const port = process.env.PORT || 8000;

app.disable("x-powered-by");

app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 4000000,
    },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { info: req.flash("info"), danger: req.flash("danger") });
});
app.post("/contact-form", (req, res) => {
  sendMail(req);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
