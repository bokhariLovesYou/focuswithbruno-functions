const { db } = require("../util/admin");

exports.getAllTasks = (req, res) => {
  db.collection("tasks")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let tasks = [];
      data.forEach((doc) => {
        tasks.push({
          taskId: doc.id,
          title: doc.data().title,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          userId: doc.data().userId,
          createdAt: doc.data().createdAt,
          dueDate: doc.data().dueDate,
          status: doc.data().status,
        });
      });
      return res.json(tasks);
    })
    .catch((err) => console.error(err));
};

exports.getAllTasksByUserID = (req, res) => {
  const userId = req.params.userId;
  db.collection("tasks")
    .orderBy("createdAt", "asc")
    .get()
    .then((data) => {
      let tasks = [];
      data.forEach((doc) => {
        if (doc.data().userId === userId) {
          tasks.push({
            taskId: doc.id,
            title: doc.data().title,
            body: doc.data().body,
            userHandle: doc.data().userHandle,
            userId: doc.data().userId,
            createdAt: doc.data().createdAt,
            dueDate: doc.data().dueDate,
            status: doc.data().status,
          });
        }
      });
      return res.json(tasks);
    })
    .catch((err) => console.error(err));
};

exports.getIncompletedTasksByUserID = (req, res) => {
  const userId = req.params.userId;
  db.collection("tasks")
    .orderBy("createdAt", "asc")
    .get()
    .then((data) => {
      let tasks = [];
      data.forEach((doc) => {
        if (doc.data().userId === userId && doc.data().status !== "Completed") {
          tasks.push({
            taskId: doc.id,
            title: doc.data().title,
            body: doc.data().body,
            userHandle: doc.data().userHandle,
            userId: doc.data().userId,
            createdAt: doc.data().createdAt,
            dueDate: doc.data().dueDate,
            status: doc.data().status,
          });
        }
      });
      return res.json(tasks);
    })
    .catch((err) => console.error(err));
};

exports.getOneTask = (req, res) => {
  let taskData = {};
  db.doc(`/tasks/${req.params.taskId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Task not found" });
      }
      taskData = doc.data();
      taskData.taskId = doc.id;
      return res.json(taskData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.postOneTask = (req, res) => {
  const newTask = {
    title: req.body.title,
    body: req.body.body,
    userHandle: req.user.handle,
    userId: req.user.uid,
    status: req.body.status,
    createdAt: new Date().toISOString(),
    dueDate: req.body.dueDate,
  };
  db.collection("tasks")
    .add(newTask)
    .then((doc) => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
};

exports.updateTaskStatus = (req, res) => {
  db.collection("tasks")
    .doc(req.params.taskId)
    .update({ status: req.body.status })
    .then(() => {
      res.json({ message: `document updated successfully` });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.updateTask = (req, res) => {
  const updatedTask = {
    title: req.body.title,
    body: req.body.body,
    createdAt: req.body.createdAt,
    userHandle: req.user.handle,
    status: req.body.status,
    dueDate: req.body.dueDate,
  };
  db.collection("tasks")
    .doc(req.params.taskId)
    .update(updatedTask)
    .then(() => {
      res.json({ message: `document updated successfully` });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
