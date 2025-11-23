const express = require("express");
const router = express.Router();

let books = require("./books");
let users = require("./users");


router.get("/books", (req, res) => {
  res.send(books);
});


router.get("/books/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  res.send(books[isbn] || { message: "Book not found" });
});


router.get("/books/author/:author", (req, res) => {
  const author = req.params.author.toLowerCase();
  const result = Object.values(books).filter(
    (b) => b.author.toLowerCase() === author
  );
  res.send(result);
});


router.get("/books/title/:title", (req, res) => {
  const title = req.params.title.toLowerCase();
  const result = Object.values(books).filter(
    (b) => b.title.toLowerCase() === title
  );
  res.send(result);
});


router.get("/books/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  res.send(books[isbn]?.reviews || { message: "No reviews found" });
});


router.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (users.find((u) => u.username === username)) {
    return res.status(400).send("User already exists");
  }

  users.push({ username, password });
  res.send("User registered successfully");
});


router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) return res.status(400).send("Invalid login");

  res.send("Login successful");
});


router.put("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { username, review } = req.body;

  books[isbn].reviews[username] = review;

  res.send("Review added/updated");
});


router.delete("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { username } = req.body;

  delete books[isbn].reviews[username];

  res.send("Review deleted");
});

module.exports = router;