const functions = require("firebase-functions");
const app = require("express")();

const FBAuth = require("./util/fbAuth");

const cors = require("cors");
app.use(cors());

const {
  getAllTasks,
  postOneTask,
  getAllTasksByUserID,
  getIncompletedTasksByUserID,
  updateTaskStatus,
  getOneTask,
  updateTask,
} = require("./handlers/tasks");
const { signup, login } = require("./handlers/users");

// Tasks Routes
app.get("/tasks", getAllTasks);
app.get("/task/:taskId", getOneTask);
app.get("/tasks/:userId", getAllTasksByUserID);
app.get("/incompletedtasks/:userId", getIncompletedTasksByUserID);
// TODO: Delete task by ID
// TODO: Get a task by ID
// TODO: Update a task by ID
app.post("/task", FBAuth, postOneTask);
app.post("/updatetaskstatus/:taskId", FBAuth, updateTaskStatus);
app.post("/updatetask/:taskId", FBAuth, updateTask);

// users routes
app.post("/signup", signup);
app.post("/login", login);

exports.api = functions.https.onRequest(app);
