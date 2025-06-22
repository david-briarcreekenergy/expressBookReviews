const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: 'You must provide a username and password to register',
    });
  }

  users.push({ username: username, password: password });

  return res.status(200).json({ message: 'User successfully registered' });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.send(JSON.stringify({ books }, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (!isbn) {
    return res.status(400).json({
      message: 'You can only retrieve a book by including its ISBN number',
    });
  }

  const book = books[isbn];

  if (!book) {
    return res
      .status(404)
      .json({ message: `No book by ISBN ${isbn} could be found` });
  }

  return res.status(200).json({ book }, null, 4);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  if (!author) {
    return res
      .status(400)
      .json({ message: 'You must include author name in the request' });
  }

  const booksByAuthor = Object.values(books).filter(
    book => book.author.toLowerCase() === author.toLowerCase(),
  );

  if (!booksByAuthor) {
    return res
      .status(404)
      .json({ message: `No books by the author ${author} could be found` });
  }

  return res.status(200).json({ booksByAuthor }, null, 4);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  if (!title) {
    return res
      .status(400)
      .json({ message: 'You must include title in the request' });
  }

  const booksByTitle = Object.values(books).filter(
    book => book.title.toLowerCase() === title.toLowerCase(),
  );

  if (!booksByTitle) {
    return res
      .status(404)
      .json({ message: `No books by the title ${title} could be found` });
  }

  return res.status(200).json({ booksByTitle }, null, 4);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (!isbn) {
    return res.status(400).json({
      message:
        'You can only retrieve a book review by including its ISBN number',
    });
  }

  const book = books[isbn];

  if (!book) {
    return res
      .status(404)
      .json({ message: `No book by ISBN ${isbn} could be found` });
  }

  return res.status(200).json(book.reviews, null, 4);
});

module.exports.general = public_users;
