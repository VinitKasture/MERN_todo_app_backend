require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

const todoRoutes = require("./routes/todos.route");
const authRoutes = require("./routes/auth.route");

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

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
