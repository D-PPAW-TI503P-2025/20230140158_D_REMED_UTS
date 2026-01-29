const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  res.json({ message: "POST /api/borrow (coming soon)" });
});

module.exports = router;
