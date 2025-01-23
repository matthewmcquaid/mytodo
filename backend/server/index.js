import express  from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import logipaddress from './middleware/logipaddress.js';
import { validationResult, query } from 'express-validator';

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', [query('name').trim().escape()], logipaddress, (req, res) => {
    const queryTest = req.query.test;
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

    res.send('G\'Day Mate' + queryTest);
});

const todos = [];

app.get('/api/todos', logipaddress, (req, res) => {
    res.json(todos);
});

app.post('/api/todos', logipaddress, (req, res) => {
    const task = req.body.task;
    if (!task) {
        res.sendStatus(400);
        return;
    }   
    todos.push({id: todos.length + 1, task});

    res.sendStatus(201);
});

app.delete('/api/todos/:id', logipaddress, (req, res) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) {
        res.sendStatus(404);
        return;
    }
    todos.splice(index, 1);
    res.sendStatus(204);
});

const PORT = 3010
app.listen(PORT, logipaddress, () => {
    console.log('Server is running on http://localhost:' + PORT);
});
