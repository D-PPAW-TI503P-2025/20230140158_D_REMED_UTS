const express = require("express");
const router = express.Router();

const borrowController = require("../controllers/borrowController");
const { requireUser, requireAdmin } = require("../middlewares/roleMiddleware");

// Admin: lihat semua log
router.get("/", requireAdmin, borrowController.getAllBorrowLogs);

// User: borrow buku
router.post("/", requireUser, borrowController.borrowBook);

module.exports = router;
