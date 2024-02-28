require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Routes
const todoRoutes = require("./routes/todos.route");
const authRoutes = require("./routes/auth.route");

const app = express();

const PORT = process.env.PORT || 8000;

const corsOpts = {
  origin: "*",

  methods: ["GET", "POST"],

  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOpts));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.removeHeader("x-powered-by");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(todoRoutes);
app.use(authRoutes);

Promise.all([
  (async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URL);
      console.log("=========== Connected to Backend Database ============");
    } catch (err) {
      console.log("============ Error Connecting To Database ============ ");
      console.error(err);
      throw err;
    }
  })(),
]);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
