import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (taskName === '' || taskName === null) {
      return;
    } else {
      axios.put('http://localhost:3000/api/tasks/', { name: taskName })
        .then(response => {
          // concat with previously recorded tasks
          setTasks([...tasks, response.data]);
          // reset to empty string
          setTaskName('');
        });
    }
  };

  const handleDelete = id => {
    axios.delete(`http://localhost:3000/api/tasks/${id}`)
      .then(response => {
        if (response.data === 'OK') {
          const removeDeleted = tasks.filter(task => task.task_id !== id);
          setTasks(removeDeleted);
        }
      })
  };

  const handleChange = e => setTaskName(e.target.value);

  const handleToggle = task => {
    axios.post(`http://localhost:3000/api/tasks/${task.task_id}`, { isDone: !task.is_done})
      .then(response => {
        const updatedTask = response.data;
        const updatedTasks = tasks.map(taskk => (taskk.task_id === updatedTask.task_id) ? updatedTask : taskk);
        setTasks(updatedTasks);
      })
      .catch(err => console.error(err));
  }

  // component did mount
  useEffect(() => {
    axios.get('http://localhost:3000/api/tasks/')
      .then(response => setTasks(response.data))
      .catch(err => console.error('error fetching ', err));
  });

  return (
    <div>
      <h1>Todos</h1>
      <ul>
        {tasks.map(task => (
          <li key={task.task_id}>
            <input type="checkbox" checked={task.is_done} onChange={() => handleToggle(task)} />
            <p className={task.is_done ? 'task_done' : ''}>{task.task_name}</p>
            <button onClick={() => handleDelete(task.task_id)}>Delete</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          type="text"
          placeholder="Add a new task"
          value={taskName}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  )
}

export default App;
