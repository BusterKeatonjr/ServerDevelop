const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Middleware для парсинга JSON
app.use(bodyParser.json());

// Временное хранилище данных
let tasks = [
  { id: 1, title: "Task 1", completed: false },
  { id: 2, title: "Task 2", completed: true },
];

// Получить все задачи (GET)
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// Получить задачу по ID (GET)
app.get("/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

// Создать новую задачу (POST)
app.post("/tasks", (req, res) => {
  const { title, completed } = req.body;
  const newTask = {
    id: tasks.length + 1,
    title,
    completed: completed || false,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Обновить задачу (PUT)
app.put("/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (task) {
    const { title, completed } = req.body;
    task.title = title || task.title;
    task.completed = completed !== undefined ? completed : task.completed;
    res.json(task);
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

// Удалить задачу (DELETE)
app.delete("/tasks/:id", (req, res) => {
  const taskIndex = tasks.findIndex((t) => t.id === parseInt(req.params.id));
  if (taskIndex > -1) {
    tasks.splice(taskIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});