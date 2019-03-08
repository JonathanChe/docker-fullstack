const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {
  createTask,
  deleteTask,
  updateTask,
  getAllTasks,
} = require('./pg');
const app = express();

app.use(express.static('./client/build'));

app.use(cors());
app.use(bodyParser.json());

app.put('/api/tasks/', (req, res) => {
  const { name } = req.body;
  createTask(name, (err, task) => {
    return err ? res.sendStatus(500) : res.send(JSON.stringify(task));
  });
});

app.get('/api/tasks', (req, res) => {
  getAllTasks((err, tasks) => {
    return err ? res.sendStatus(500) : res.send(JSON.stringify(tasks));
  });
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.body;
  deleteTask(id, (err) => {
    return err ? res.sendStatus(500) : res.sendStatus(200);
  });
});

app.post('/api/tasks/:id', (req, res) => {
  const { id } = req.params.id;
  const { isDone } = req.body;
  updateTask(id, isDone, (err, task) => {
    return err ? res.sendStatus(500) : res.send(JSON.stringify(task));
  });
});

app.get('/', (req, res) => {
  res.send('hello world');
});

app.listen(3000, () => console.log('Server started'));
