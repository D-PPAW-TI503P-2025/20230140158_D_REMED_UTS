const { sequelize, Book, BorrowLog } = require("../models");

// POST /api/borrow (user)
async function borrowBook(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const userId = req.userId; // dari middleware requireUser
    const { bookId, latitude, longitude } = req.body;

    // validasi input
    const bookIdNum = Number(bookId);
    if (!bookId || isNaN(bookIdNum)) {
      await t.rollback();
      return res.status(400).json({ message: "bookId is required and must be a number" });
    }

    const latNum = Number(latitude);
    const lonNum = Number(longitude);
    if (latitude === undefined || isNaN(latNum)) {
      await t.rollback();
      return res.status(400).json({ message: "latitude is required and must be a number" });
    }
    if (longitude === undefined || isNaN(lonNum)) {
      await t.rollback();
      return res.status(400).json({ message: "longitude is required and must be a number" });
    }

    // cari buku (pakai transaction + lock biar aman)
    const book = await Book.findByPk(bookIdNum, { transaction: t, lock: t.LOCK.UPDATE });
    if (!book) {
      await t.rollback();
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.stock <= 0) {
      await t.rollback();
      return res.status(400).json({ message: "Stock is empty. Cannot borrow this book." });
    }

    // kurangi stok
    book.stock = book.stock - 1;
    await book.save({ transaction: t });

    // buat log peminjaman + lokasi
    const log = await BorrowLog.create(
      {
        userId,
        bookId: bookIdNum,
        latitude: latNum,
        longitude: lonNum
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(201).json({
      message: "Borrow success",
      data: {
        borrowLog: log,
        book: book
      }
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

// GET /api/borrow (admin - lihat semua log)
async function getAllBorrowLogs(req, res, next) {
  try {
    const logs = await BorrowLog.findAll({
      order: [["id", "DESC"]]
    });
    return res.json(logs);
  } catch (err) {
    next(err);
  }
}

module.exports = { borrowBook, getAllBorrowLogs };
