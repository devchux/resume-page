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
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const message = req.flash("message");
  res.render("index", { message });
});
app.post("/contact-form", (req, res) => {
  const { from, subject, message } = req.body;

  if (!from) {
    req.flash('message', 'Please enter a recipient email address.')
    return res.redirect("/");
  }

  if (!subject && !message) {
    req.flash('message', 'Please type in a message.')
    return res.redirect("/");
  }
  sendMail(req).then(() => {
    req.flash('message', 'A response email has been sent you. Thank you.')
    res.redirect("/");
  }).catch(error => {
    req.flash('message', error.message);
    res.redirect("/");
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
