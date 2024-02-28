const User = require("../models/User");

const getAllTodos = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ todos: user.todos });
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const todo = req.body.todo;
    const result = await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        todos: { todo: todo },
      },
    });
    res.status(200).json({ message: "Task deleted successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
};

const addTodo = async (req, res) => {
  try {
    const todo = req.body.todo;
    const user = await User.findOne({
      _id: req.user._id,
      todos: { $elemMatch: { todo: todo } },
    });

    if (user) {
      return res.status(409).json({ message: "Todo already exists!" });
    }

    const result = await User.findByIdAndUpdate(req.user._id, {
      $push: {
        todos: { todo: todo },
      },
    });

    res.status(200).json({ message: "Task added successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
};

const editTodo = async (req, res) => {
  try {
    const todo = req.body.todo;
    const newTodo = req.body.newTodo;

    const result = await User.findOneAndUpdate(
      { _id: req.user._id, "todos.todo": todo },
      { $set: { "todos.$.todo": newTodo } }
    );

    if (!result) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ message: "Task edited successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
};

const completeTodo = async (req, res) => {
  try {
    const todoText = req.body.todo;

    const result = await User.findOneAndUpdate(
      {
        _id: req.user._id,
        "todos.todo": todoText,
      },
      {
        $set: { "todos.$.isCompleted": true },
      }
    );
    if (!result) {
      return res
        .status(404)
        .json({ message: "Todo not found or already completed" });
    }

    res.status(200).json({ message: "Task completed successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
};

module.exports = { getAllTodos, deleteTodo, completeTodo, addTodo, editTodo };
