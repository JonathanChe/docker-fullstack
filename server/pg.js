const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'postgres.localhost',
  database: 'postgres',
  password: 'mysecretpassword',
  port: 5432,
});

const createTableString = `
  CREATE TABLE IF NOT EXISTS tasks(
    task_id SERIAL PRIMARY KEY,
    task_name VARCHAR(255) NOT NULL,
    is_done boolean NOT NULL DEFAULT false
  );
`;

pool.query(createTableString, (err, res) => {
  return err ? console.error(err) : console.log(res);
});

export const createTask = (name, cb) => {
  pool.query('INSERT INTO tasks (task_name) VALUES ($1) RETURNING *;', [name], (err, res) => {
    return err ? cb(err, null) : cb(null, res.rows[0]);
  });
};

export const getAllTasks = (cb) => {
  pool.query('SELECT * FROM tasks;', (err, res) => {
    return err ? cb(err, null) : cb(null, res.rows);
  });
};

export const deleteTask = (id, cb) => {
  pool.query('DELETE FROM tasks WHERE task_id = $1;', [id], (err, res) => {
    return err ? cb(err) : cb(null);
  });
};

export const updateTask = (id, isDone, cb) => {
  pool.query('UPDATE tasks SET is_done = $1 WHERE task_id = $2 RETURNING *;', [isDone, id], (err, res) => {
    return err ? cb(err, null) : cb(null, res.rows[0]);
  });
};
