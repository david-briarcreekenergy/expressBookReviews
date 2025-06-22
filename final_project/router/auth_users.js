const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = username => {
  return users.find(user => user.username === username) ? true : false;
};

const authenticatedUser = (username, password) => {
  return users.find(
    user => user.username === username && user.password === password,
  )
    ? true
    : false;
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({
      message: 'You must include the username and password to log in.',
    });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      'access',
      { expiresIn: 60 * 60 },
    );

    // Store access token and username in session
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send('User successfully logged in');
  } else {
    return res
      .status(208)
      .json({ message: 'Invalid Login. Check username and password' });
  }
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  if (!isbn || !review) {
    return res.status(400).json({
      message:
        'You must include the ISBN, username, and the review to post a review.',
    });
  }

  const book = books[isbn];

  if (!book) {
    return res
      .status(404)
      .json({ message: `No book by the ISBN ${isbn} can be found.` });
  }

  book.reviews[req.session.authorization.username] = review;

  return res.status(200).json({ book });
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (!isbn) {
    return res
      .status(400)
      .json({ message: 'You must include the ISBN to delete a review.' });
  }

  const book = books[isbn];

  if (!book) {
    return res
      .status(404)
      .json({ message: `No book by the ISBN ${isbn} can be found.` });
  }

  delete book.reviews[req.session.authorization.username];

  return res.status(200).json({ message: 'Review successfully deleted', book });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
