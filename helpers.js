const { urlDatabase, users } = require("./data");

function generateRandomString() {
  const id = Math.random().toString(36).substring(2, 8);
  return id;
}

function findUserByEmail(formEmail, users) {
  for (let user of Object.values(users)) {
    if (user.email === formEmail) {
      return user;
    }
  }
  return false;
}

function findTinyURL(enteredId) {
  for (let tinyurl of Object.keys(urlDatabase)) {
    if (tinyurl === enteredId) {
      return true;
    }
  }
}

function urlsForUser(id) {
  let userURLs = {};
  const arrDBVal = Object.values(urlDatabase);
  const arrDBKey = Object.keys(urlDatabase);
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
}

module.exports = {generateRandomString,
                  findUserByEmail,
                  findTinyURL,
                  urlsForUser};