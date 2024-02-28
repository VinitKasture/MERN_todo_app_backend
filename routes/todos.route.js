const express = require("express");
const router = express.Router();

const {
  getAllTodos,
  deleteTodo,
  completeTodo,
  addTodo,
  editTodo,
} = require("../controllers/todo.controller");
const { validateToken } = require("../middleware/jwt.middleware");

router.get("/get-all-todos", validateToken, getAllTodos);
router.post("/delete-todo", validateToken, deleteTodo);
router.post("/edit-todo", validateToken, editTodo);
router.post("/complete-todo", validateToken, completeTodo);
router.post("/add-todo", validateToken, addTodo);

module.exports = router;
