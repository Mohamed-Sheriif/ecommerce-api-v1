const path = require("path");

const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

// Error handler
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");

// import routes
const mountRoutes = require("./routes");

dotenv.config({ path: "./config.env" });
const dbConnection = require("./config/database");

// Connect to DB
dbConnection();

// Express app
const app = express();

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
      description: "API documentation using Swagger for E-commerce",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}/api/v1`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"], // Path to your API docs
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 400));
});

// Global error handler middleware
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Error: ${err.name} | ${err.message}!`);
  server.close(() => {
    console.error("Server closed!");
    process.exit(1);
  });
});
