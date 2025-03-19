const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const compression = require("compression");
const cors = require("cors");
const httpStatus = require("http-status");
const createError = require("http-errors");
const morgan = require("morgan");
 const routes = require("./routes/v1");
const app = express();
app.use(morgan("dev"));
// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());


// gzip compression
app.use(compression());
// enable cors
app.use(cors());
app.options("*", cors());


app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Middleware to add CORP header
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

app.use('/uploads', express.static('public/uploads'));

// version V1 router is here
app.use("/api/v1", routes);
// teat api endpoint
app.get("/", async (req, res, next) => {
  res.send({ message: "Awesome it works 🐻" });
});

// if api not found show error message router
app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});
module.exports = app;
