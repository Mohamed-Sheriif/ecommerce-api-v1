const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

// import routes
const categoryRoute = require("./routes/categoryRoute");

dotenv.config({ path: "./config.env" });
const dbConnection = require("./config/database");

// Connect to DB
dbConnection();

// Express app
const app = express();

// Middleware
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount routes
app.use("/api/v1/categories", categoryRoute);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
