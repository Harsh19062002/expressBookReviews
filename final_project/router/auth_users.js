const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return username && !users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({message: "Username and password are required."});
  }

  if (authenticatedUser(username, password)) {
    // Generate a JWT token upon successful login
    const token = jwt.sign({ username: username }, 'Harsh_Secret'); // Replace 'your-secret-key' with a strong, unique secret
    req.session.authorization = { token, username }; // Store token in session (if using sessions)
    return res.status(200).json({ message: "User logged in successfully.", token });
  } else {
    return res.status(401).json({message: "Invalid username or password."});
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const reviewText = req.body.review;
  const username = req.session.authorization ? req.session.authorization.username : null; // Get username from session

  if (!username) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }

  if (reviewText === undefined) {
    return res.status(400).json({ message: "Review text is required." });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = reviewText;
  return res.status(200).json({ message: `Review for book with ISBN ${isbn} added/modified successfully by ${username}.` });
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
