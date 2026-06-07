const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let tasks = [];

try {
  const data = fs.readFileSync(
    "./server/tasks.json",
    "utf8"
  );

  tasks = JSON.parse(data);
} catch (error) {
  tasks = [];
}
function saveTasks() {
  fs.writeFileSync(
    "./server/tasks.json",
    JSON.stringify(tasks, null, 2)
  );
}
let currentId =
  tasks.length > 0
    ? Math.max(...tasks.map(task => task.id)) + 1
    : 1;


app.get("/tasks", (req, res) => {
  const status = req.query.status;

  let result = [...tasks];

  if (status === "active") {
    result = result.filter(task => !task.completed);
  }

  if (status === "completed") {
    result = result.filter(task => task.completed);
  }

  result.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  res.json(result);
});


app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  res.json(task);
});


app.post("/tasks", (req, res) => {
  const { title, description, dueDate } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({
      message: "Title is required"
    });
  }

  const newTask = {
    id: currentId++,
    title,
    description: description || "",
    dueDate: dueDate || null,
    completed: false,
    createdAt: new Date()
  };

  tasks.unshift(newTask);

saveTasks();

  res.status(201).json({
    message: "Task added successfully",
    task: newTask
  });
});


app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  const { title, description, dueDate } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({
      message: "Title is required"
    });
  }

  task.title = title;
  task.description = description || "";
  task.dueDate = dueDate || null;
  saveTasks();
  res.json({
    message: "Task updated successfully",
    task
  });
});


app.patch("/tasks/:id/toggle", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  task.completed = !task.completed;
  saveTasks();

  res.json({
    message: "Task status updated",
    task
  });
});


app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  tasks.splice(index, 1);
  saveTasks();

  res.json({
    message: "Task deleted successfully"
  });
});


app.get("/tasks/search", (req, res) => {
  const query = req.query.q?.toLowerCase() || "";

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(query)
  );

  res.json(filteredTasks);
});


app.get("/stats", (req, res) => {
  const active = tasks.filter(task => !task.completed).length;

  const completed = tasks.filter(task => task.completed).length;

  res.json({
    total: tasks.length,
    active,
    completed
  });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});