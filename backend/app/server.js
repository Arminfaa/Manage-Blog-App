const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const allRoutes = require("./router/router");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const createError = require("http-errors");
const path = require("path");
dotenv.config();
class Application {
  #app = express();
  #PORT = process.env.PORT || 5000;
  #DB_URI = process.env.MONGODB_URI;

  constructor() {
    this.createServer();
    this.connectToDB();
    this.configServer();
    this.initClientSession();
    this.configRoutes();
    this.errorHandling();
  }
  createServer() {
    this.#app.listen(this.#PORT, () =>
      console.log(`listening on port ${this.#PORT}`)
    );
  }
  connectToDB() {
    mongoose.set("strictQuery", true);
    mongoose.connect(
      `${this.#DB_URI}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        authSource: "admin",
      },
      (err) => {
        if (!err) {
          console.log("MongoDB connected!!");
        } else {
          console.log("Failed to connect to MongoDB", err);
        }
      }
    );
  }
  configServer() {
    const corsOptions = {
      credentials: true,
      origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        // Allow specific origins
        const allowedOrigins = [
          process.env.ALLOW_CORS_ORIGIN,
          'https://manage-blog-app.vercel.app',
          'https://manage-blog-app-*.vercel.app', // Preview deployments
        ].filter(Boolean);

        if (allowedOrigins.includes(origin) || allowedOrigins.some(pattern =>
          new RegExp(pattern.replace('*', '.*')).test(origin)
        )) {
          return callback(null, true);
        }

        // For development, allow localhost
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
          return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
      }
    };

    this.#app.use(cors(corsOptions));
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(express.static(path.join(__dirname, "..")));
  }
  initClientSession() {
    this.#app.use(cookieParser(process.env.COOKIE_PARSER_SECRET_KEY));
  }
  configRoutes() {
    this.#app.use("/api", allRoutes);
  }
  errorHandling() {
    this.#app.use((req, res, next) => {
      next(createError.NotFound("آدرس مورد نظر یافت نشد"));
    });
    this.#app.use((error, req, res, next) => {
      const serverError = createError.InternalServerError();
      const statusCode = error.status || serverError.status;
      const message = error.message || serverError.message;
      return res.status(statusCode).json({
        statusCode,
        message,
      });
    });
  }
}

module.exports = Application;
