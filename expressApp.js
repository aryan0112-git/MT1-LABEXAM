import express from "express";

const app = express();
const PORT = 4000;

// B1: Middleware to read JSON request bodies
app.use(express.json());

// B3: Sample employee task records
let tasks = [
  {
    id: 1,
    taskName: "Develop Login Page",
    assignedTo: "Rahul Sharma",
    status: "Pending",
    priority: "High"
  },
  {
    id: 2,
    taskName: "Design Dashboard",
    assignedTo: "Priya Verma",
    status: "In Progress",
    priority: "Medium"
  },
  {
    id: 3,
    taskName: "Test Application",
    assignedTo: "Amit Kumar",
    status: "Completed",
    priority: "Low"
  }
];

// B2: GET all tasks
app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

// B2: GET a task by ID
app.get("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({ message: "Task not found." });
  }

  res.status(200).json(task);
});

// B2: POST a new task
app.post("/tasks", (req, res) => {
  const { id, taskName, assignedTo, status, priority } = req.body;

  if (
    id === undefined ||
    !taskName ||
    !assignedTo ||
    !status ||
    !priority
  ) {
    return res.status(400).json({
      message: "Please provide id, taskName, assignedTo, status and priority."
    });
  }

  if (tasks.some((task) => task.id === Number(id))) {
    return res.status(409).json({ message: "A task with this ID already exists." });
  }

  const newTask = {
    id: Number(id),
    taskName,
    assignedTo,
    status,
    priority
  };

  tasks.push(newTask);

  res.status(201).json({
    message: "Task added successfully",
    task: newTask
  });
});

// B2: PUT update a task
app.put("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const taskIndex = tasks.findIndex((item) => item.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found." });
  }

  const { taskName, assignedTo, status, priority } = req.body;

  if (!taskName || !assignedTo || !status || !priority) {
    return res.status(400).json({
      message: "Please provide taskName, assignedTo, status and priority."
    });
  }

  tasks[taskIndex] = {
    id: taskId,
    taskName,
    assignedTo,
    status,
    priority
  };

  res.status(200).json({
    message: "Task updated successfully",
    task: tasks[taskIndex]
  });
});

// B2: DELETE a task
app.delete("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const taskIndex = tasks.findIndex((item) => item.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found." });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];

  res.status(200).json({
    message: "Task deleted successfully",
    task: deletedTask
  });
});

// Handle invalid JSON bodies
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Invalid JSON request body." });
  }
  next(error);
});

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
