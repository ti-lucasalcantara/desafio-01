const express = require("express");

const app = express();

app.use(express.json());

let numberOfRequests = 0;
const projects = [];

/**
 * global middlewares
 */
function checkProjectExist(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);

  if (!project) {
    return res.status(400).json({ error: "Projeto inexistente" });
  }

  return next();
}

function logRequest(req, res, next) {
  numberOfRequests++;
  console.log(`${numberOfRequests} requisições.`);

  return next();
}
app.use(logRequest);

/**
 * routes
 */

app.get("/projects", (req, res) => {
  return res.json(projects);
});

app.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const project = { id, title, task: [] };

  projects.push(project);

  return res.json(project);
});

app.post("/projects/:id/task", checkProjectExist, (req, res) => {
  const { id } = req.params;
  const { task } = req.body;

  const project = projects.find(p => p.id === id);
  project.task.push(task);

  return res.json(project);
});

app.put("/projects/:id", checkProjectExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);
  project.title = title;

  return res.json(project);
});

app.delete("/projects/:id", checkProjectExist, (req, res) => {
  const { id } = req.params;
  const project = projects.findIndex(p => p.id === id);

  projects.splice(project, 1);

  return res.send();
});

app.listen(3000);
