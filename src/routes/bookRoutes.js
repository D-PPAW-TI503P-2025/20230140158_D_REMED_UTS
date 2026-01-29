const express = require("express");
const router = express.Router();

const bookController = require("../controllers/bookController");
const { requireAdmin } = require("../middlewares/roleMiddleware");

// Public
router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getBookById);

// Admin Mode (header x-user-role: admin)
router.post("/", requireAdmin, bookController.createBook);
router.put("/:id", requireAdmin, bookController.updateBook);
router.delete("/:id", requireAdmin, bookController.deleteBook);

module.exports = router;
