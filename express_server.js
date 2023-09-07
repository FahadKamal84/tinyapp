const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set("view engine", "ejs")

function generateRandomString() {
  const id = Math.random().toString(36).substring(2,8);
  return id;
};

function findEmail (formEmail, users) {
  for (let user of Object.values(users)) {
    if (user.email === formEmail) {
      return true;
    };
  };
  return false;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]] };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]] }
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], user: users[req.cookies["user_id"]] };
  res.render("urls_show", templateVars);
});


app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const templateVars = {user: users[req.cookies["user_id"]]}
  res.render("urls_register", templateVars);
})

app.post("/urls", (req, res) => {
  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  console.log(req.body); // Log the POST request body to the console
  res.redirect(`urls/${id}`);  //redirecting to newly generated 6 digit short url id
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.post("/urls/:id/delete", (req,res) => {
  console.log(req.params.id);
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  console.log(req.params.id);
  urlDatabase[req.params.id] = req.body.updatedURL;
  res.redirect(`/urls`);
});

//app.post("/login", (req, res) => {
//  res.cookie("username", req.body.username);
//  res.redirect('/urls');
//});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const user_id = generateRandomString();
  if (req.body.email === "" || req.body.password === "") {
   return res.status(400).end("HTTP error: 400.  Please fill out email AND password field");
  }
  if (findEmail(req.body.email, users)) {
    return res.status(400).end("HTTP ERROR: 400. Cannot register this email. Email already registered");
  }

  users[user_id] = {id: user_id, email: req.body.email, password: req.body.password};
  res.cookie("user_id", user_id);
  console.log(users[user_id]);
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});