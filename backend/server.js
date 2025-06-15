const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows);
  });
});

app.post('/tasks', (req, res) => {
  const { title } = req.body;
  db.run('INSERT INTO tasks (title) VALUES (?)', [title], function (err) {
    if (err) return res.status(500).send(err);
    res.json({ id: this.lastID, title, completed: 0 });
  });
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run('UPDATE tasks SET completed = NOT completed WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
