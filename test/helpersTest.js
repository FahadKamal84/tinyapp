const { assert } = require('chai');

const { findUserByEmail, findTinyURL, urlsForUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
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

describe('findUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = findUserByEmail("user@example.com", testUsers)
    const expectedUserObj = { id: "userRandomID", email: "user@example.com", password: "purple-monkey-dinosaur" };
    
    assert.deepEqual(user, expectedUserObj);
  });

  it('return undefined if email is nonexistent', function() {
    const user = findUserByEmail("test@example.com", testUsers)
    const expectedUserObj = undefined;
    
    assert.deepEqual(user, expectedUserObj);

  })
});

describe('findTinyURL', function() {
  it('should return true if tinyurl exists in database', function() {
    const user = findTinyURL("b2xVn2");
    const expectedTinyURL = true;
    
    assert.strictEqual(user, expectedTinyURL);
  });

  it('should return undefined if tinyurl does not exist in database', function() {
    const user = findTinyURL("g7r3j6");
    const expectedTinyURL = undefined;
    
    assert.strictEqual(user, expectedTinyURL);
  });

});

describe('urlsForUser', function() {
  it('should return urls owned by entered user id', function() {
    const userURLs = urlsForUser("userRandomID");
    const expectedURLs = { "b2xVn2": "http://www.lighthouselabs.ca" } ;
    
    assert.deepEqual(userURLs, expectedURLs);
  });

  it('should return empty object if urls are not owned by user id', function() {
    const userURLs = urlsForUser("testID");
    const expectedURLs = {};
    
    assert.deepEqual(userURLs, expectedURLs);
  });

});

