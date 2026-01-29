const { Book } = require("../models");

// GET /api/books (public)
async function getAllBooks(req, res, next) {
  try {
    const books = await Book.findAll({ order: [["id", "ASC"]] });
    return res.json(books);
  } catch (err) {
    next(err);
  }
}

// GET /api/books/:id (public)
async function getBookById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid book id" });

    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    return res.json(book);
  } catch (err) {
    next(err);
  }
}

// POST /api/books (admin)
async function createBook(req, res, next) {
  try {
    const { title, author, stock } = req.body;

    // validasi sederhana (sesuai instruksi)
    if (!title || String(title).trim() === "") {
      return res.status(400).json({ message: "title is required" });
    }
    if (!author || String(author).trim() === "") {
      return res.status(400).json({ message: "author is required" });
    }

    const stockNum = stock === undefined ? 0 : Number(stock);
    if (isNaN(stockNum) || stockNum < 0) {
      return res.status(400).json({ message: "stock must be a number >= 0" });
    }

    const newBook = await Book.create({
      title: String(title).trim(),
      author: String(author).trim(),
      stock: stockNum
    });

    return res.status(201).json({ message: "Book created", data: newBook });
  } catch (err) {
    next(err);
  }
}

// PUT /api/books/:id (admin)
async function updateBook(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid book id" });

    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const { title, author, stock } = req.body;

    // validasi: kalau dikirim, tidak boleh kosong
    if (title !== undefined && String(title).trim() === "") {
      return res.status(400).json({ message: "title cannot be empty" });
    }
    if (author !== undefined && String(author).trim() === "") {
      return res.status(400).json({ message: "author cannot be empty" });
    }
    if (stock !== undefined) {
      const stockNum = Number(stock);
      if (isNaN(stockNum) || stockNum < 0) {
        return res.status(400).json({ message: "stock must be a number >= 0" });
      }
      book.stock = stockNum;
    }

    if (title !== undefined) book.title = String(title).trim();
    if (author !== undefined) book.author = String(author).trim();

    await book.save();

    return res.json({ message: "Book updated", data: book });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/books/:id (admin)
async function deleteBook(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid book id" });

    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    await book.destroy();
    return res.json({ message: "Book deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};
