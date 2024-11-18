const mongoose = require("mongoose");

// Connect to DB
const dbConnection = () => {
  mongoose.connect(process.env.DB_URI).then((conn) => {
    console.log(`DB connection successful: ${conn.connection.host}}`);
  });
};

module.exports = dbConnection;
