const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }
  if (isValid(username)) {
    users.push({ "username": username, "password": password }); // In a real application, hash the password!
    return res.status(201).json({ message: "User registered successfully." });
  } else {
    return res.status(409).json({ message: "Username already exists." });
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.status(200).json(books);
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.status(200).json(books[isbn]);
  } else {
    res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const authorBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
  if (authorBooks.length > 0) {
    res.status(200).json(authorBooks);
  } else {
    res.status(404).json({ message: `No books found by the author ${author}.` });
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const titleBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
  if (titleBooks.length > 0) {
    res.status(200).json(titleBooks);
  } else {
    res.status(404).json({ message: `No books found with the title containing ${title}.` });
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn] && books[isbn].reviews) {
    res.status(200).json(books[isbn].reviews);
  } else if (books[isbn]) {
    res.status(200).json({ message: `No reviews available for the book with ISBN ${isbn}.` });
  } else {
    res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
