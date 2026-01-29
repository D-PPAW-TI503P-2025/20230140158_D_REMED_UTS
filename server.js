require("dotenv").config();
const express = require("express");

const { sequelize } = require("./src/models");
const errorHandler = require("./src/middlewares/errorHandler");

// routes (nanti kita isi controllernya di step berikut)
const bookRoutes = require("./src/routes/bookRoutes");
const borrowRoutes = require("./src/routes/borrowRoutes");

const app = express();
app.use(express.json());

// health check
app.get("/", (req, res) => {
  res.json({ message: "Library API is running" });
});

// api routes
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync();
    console.log("✅ Models synced");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();
