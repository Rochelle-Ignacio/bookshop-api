const axios = require("axios");

// ----------------------------------------------------
// Task 10: Get all books (async/await)
// ----------------------------------------------------
async function getAllBooks() {
  try {
    const res = await axios.get("http://localhost:5000/books");
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
}

// ----------------------------------------------------
// Task 11: Search by ISBN (Promises)
// ----------------------------------------------------
function getBookByISBN(isbn) {
  axios
    .get(`http://localhost:5000/books/isbn/${isbn}`)
    .then((res) => console.log(res.data))
    .catch((err) => console.error(err));
}

// ----------------------------------------------------
// Task 12: Search by Author
// ----------------------------------------------------
async function getBooksByAuthor(author) {
  const res = await axios.get(`http://localhost:5000/books/author/${author}`);
  console.log(res.data);
}


async function getBooksByTitle(title) {
  const res = await axios.get(`http://localhost:5000/books/title/${title}`);
  console.log(res.data);
}

getAllBooks();
