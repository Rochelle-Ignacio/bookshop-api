const express = require("express");
const app = express();

const books = require("./books");
const users = require("./users");

app.use(express.json());

let loggedInUsers = {};

app.get("/books", (req, res) => {
  res.json(books);
});

app.get("/books/isbn/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  book ? res.json(book) : res.status(404).json({ message: "Book not found" });
});

app.get("/books/author/:author", (req, res) => {
  const result = Object.values(books).filter(
    book => book.author.toLowerCase() === req.params.author.toLowerCase()
  );
  res.json(result);
});

app.get("/books/title/:title", (req, res) => {
  const result = Object.values(books).filter(
    book => book.title.toLowerCase() === req.params.title.toLowerCase()
  );
  res.json(result);
});

app.get("/books/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  book ? res.json(book.reviews) : res.status(404).json({ message: "Book not found" });
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const exists = users.find(u => u.username === username);
  if (exists) return res.status(400).json({ message: "User exists" });

  users.push({ username, password });
  res.json({ message: "User registered successfully" });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    u => u.username === username && u.password === password
  );
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  loggedInUsers[username] = true;
  res.json({ message: "Login successful" });
});

app.put("/books/review/:isbn", (req, res) => {
  const { username, review } = req.body;
  if (!loggedInUsers[username])
    return res.status(403).json({ message: "Unauthorized" });

  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });

  book.reviews[username] = review;
  res.json({ message: "Review added/updated" });
});

app.delete("/books/review/:isbn/:username", (req, res) => {
  const { isbn, username } = req.params;
  const book = books[isbn];

  if (!book || !book.reviews[username])
    return res.status(404).json({ message: "Review not found" });

  delete book.reviews[username];
  res.json({ message: "Review deleted" });
});

app.get("/async/books", async (req, res) => {
  const getBooks = () =>
    new Promise(resolve => setTimeout(() => resolve(books), 500));
  const data = await getBooks();
  res.json(data);
});

app.get("/promise/isbn/:isbn", (req, res) => {
  new Promise((resolve, reject) => {
    books[req.params.isbn]
      ? resolve(books[req.params.isbn])
      : reject("Book not found");
  })
    .then(data => res.json(data))
    .catch(err => res.status(404).json({ message: err }));
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
