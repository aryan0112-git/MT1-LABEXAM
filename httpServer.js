import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let tasks = [
  {
    id: 1,
    taskName: "Develop Login Page",
    assignedTo: "Rahul Sharma",
    status: "Pending"
  },
  {
    id: 2,
    taskName: "Design Dashboard",
    assignedTo: "Priya Verma",
    status: "In Progress"
  },
  {
    id: 3,
    taskName: "Test Application",
    assignedTo: "Amit Kumar",
    status: "Completed"
  }
];

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // A1 and A2: HTTP server and routing
  if (method === "GET" && url === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>Welcome to Employee Task Management</h1>");
    return;
  }

  if (method === "GET" && url === "/tasks") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(tasks, null, 2));
    return;
  }

  if (method === "GET" && url === "/about") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>About</h1><p>This application helps manage employee tasks.</p>");
    return;
  }

  // A3: POST /add-task
  if (method === "POST" && url === "/add-task") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const newTask = JSON.parse(body);

        const hasRequiredFields =
          newTask.id !== undefined &&
          newTask.taskName &&
          newTask.assignedTo &&
          newTask.status;

        if (!hasRequiredFields) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Please provide id, taskName, assignedTo and status." }));
          return;
        }

        if (tasks.some((task) => task.id === newTask.id)) {
          res.writeHead(409, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "A task with this ID already exists." }));
          return;
        }

        tasks.push({
          id: newTask.id,
          taskName: newTask.taskName,
          assignedTo: newTask.assignedTo,
          status: newTask.status
        });

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          message: "Task added successfully",
          task: newTask
        }));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid JSON request body." }));
      }
    });
    return;
  }

  // A4: Serve index.html using the FS module
  if (method === "GET" && url === "/home") {
    const filePath = path.join(__dirname, "public", "index.html");

    fs.readFile(filePath, "utf8", (error, data) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Error: Unable to read the home page.");
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(data);
    });
    return;
  }

  // A5: Invalid route or method
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Route not found." }));
});

server.listen(3000, () => {
  console.log("HTTP Server running at http://localhost:3000");
});
