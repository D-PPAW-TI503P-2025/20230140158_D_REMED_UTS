const sequelize = require("../config/database");

const Book = require("./Book")(sequelize);
const BorrowLog = require("./BorrowLog")(sequelize);

// relasi
Book.hasMany(BorrowLog, { foreignKey: "bookId" });
BorrowLog.belongsTo(Book, { foreignKey: "bookId" });

module.exports = {
  sequelize,
  Book,
  BorrowLog
};
