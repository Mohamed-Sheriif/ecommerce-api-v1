const mongoose = require("mongoose");

// Connect to DB
const dbConnection = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((conn) => {
      console.log(`DB connection successful: ${conn.connection.host}}`);
    })
    .catch((err) => {
      console.error(`Database Error: ${err}`);
      process.exit(1);
    });
};

module.exports = dbConnection;
