const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set("view engine", "ejs")

function generateRandomString() {
  const id = Math.random().toString(36).substring(2, 8);
  return id;
};

function findUserByEmail(formEmail, users) {
  for (let user of Object.values(users)) {
    if (user.email === formEmail) {
      return user;
    };
  };
  return false;
};

function findTinyURL (enteredId) {
  for (let tinyurl of Object.keys(urlDatabase)) {
    if (tinyurl === enteredId) {
      return true;
    }
  }
}

function urlsForUser(id) {
  let userURLs = {};
  arrDBVal = Object.values(urlDatabase)
  arrDBKey = Object.keys(urlDatabase)
  for (let i = 0; i < arrDBVal.length; i++) {
    if (arrDBVal[i].userID === id) {
      userURLs[arrDBKey[i]] = arrDBVal[i].longURL;
    }
  }
  if (!userURLs) {
    return false;
  } else {
    return userURLs;
  }
};

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: ""
  }
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
  if (!req.cookies["user_id"]) {
    res.redirect("/login");
  }
  const userURLs = urlsForUser(req.cookies["user_id"]);
  console.log(userURLs);
  const templateVars = { urls: userURLs, user: users[req.cookies["user_id"]] };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (!req.cookies["user_id"]) {
    res.redirect("/login");
  }
  const templateVars = { user: users[req.cookies["user_id"]] }
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  if (!req.cookies["user_id"]) {
    return res.send("HTTP Error: Please login.  You have to log in to accesss this page");
  }
  
  const userURLs = urlsForUser(req.cookies["user_id"])
  for (let keys in userURLs) {
    if (keys === req.params.id) {
      const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id].longURL, user: users[req.cookies["user_id"]] };
      res.render("urls_show", templateVars);
    }
  }  
  return res.send("HTTP Error: You do not have access to this URL")
});


app.get("/u/:id", (req, res) => {
  
  const doesIdExist = findTinyURL(req.params.id);
  
  if (doesIdExist) {
    const longURL = urlDatabase[req.params.id].longURL;
    res.redirect(longURL);
  } else {
    return res.status(403).end("HTTP error: This tinyURL does not exist")
  }
});

app.get("/register", (req, res) => {
  if (req.cookies["user_id"]) {
    res.redirect("/urls");
  }
  const templateVars = { user: users[req.cookies["user_id"]] }
  res.render("urls_register", templateVars);
})

app.get("/login", (req, res) => {
  if (req.cookies["user_id"]) {
    res.redirect("/urls");
  }
  const templateVars = { user: users[req.cookies["user_id"]] }
  res.render("urls_login.ejs", templateVars); 
})



app.post("/urls", (req, res) => {
  if (!req.cookies["user_id"]) {
    return res.send("Please log in to your account before creating a tinyURL");
  }
  const id = generateRandomString();
  
  urlDatabase[id] = {longURL: req.body.longURL,
                      userID: req.cookies["user_id"]};
  console.log(urlDatabase[id])
  console.log(req.body.longURL); // Log the POST request body to the console
  res.redirect(`urls/${id}`);  //redirecting to newly generated 6 digit short url id
});


app.post("/urls/:id/delete", (req, res) => {
  if (!req.cookies["user_id"]) {
    res.send("Please log in.  You need to log in to delete this URL")
  }
  const userURLs = urlsForUser(req.cookies["user_id"])
  for (let keys in userURLs) {
    if (keys === req.params.id) {
      console.log(req.params.id);
      delete urlDatabase[req.params.id];
      res.redirect("/urls");
    }
  }
  res.send("You do not have permission to delete this URL");
});

app.post("/urls/:id", (req, res) => {
  if (!req.cookies["user_id"]) {
    res.send("Please log in.  You need to log in to edit URLs")
  }

  const userURLs = urlsForUser(req.cookies["user_id"])
  for (let keys in userURLs) {
    if (keys === req.params.id) {
      console.log(req.params.id);
      urlDatabase[req.params.id].longURL = req.body.updatedURL;
      return res.redirect(`/urls`);
    }
  }
  res.send("You do not have permission to edit this URL");
});

app.post("/login", (req, res) => {
  const userByEmail = findUserByEmail(req.body.email, users);
  if (userByEmail) {
    if (userByEmail.password === req.body.password) {
      const user_id = Object.keys(users).find((key) => users[key] === userByEmail);
      res.cookie("user_id", user_id);
      res.redirect("/urls");
    } else {
      return res.status(403).end("HTTP error: 403 Forbidden. Incorrect password.")
    }
  } else {
    return res.status(403).end("HTTP error: 403 Forbidden. Email not found.")
  }
  res.redirect('/urls');
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

app.post("/register", (req, res) => {
  const user_id = generateRandomString();
  if (req.body.email === "" || req.body.password === "") {
    return res.status(400).end("HTTP error: 400.  Please fill out email AND password field");
  }
  if (findUserByEmail(req.body.email, users)) {
    return res.status(400).end("HTTP ERROR: 400. Cannot register this email. Email already registered");
  }

  users[user_id] = { id: user_id, email: req.body.email, password: req.body.password };
  res.cookie("user_id", user_id);
  console.log(users[user_id]);
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});