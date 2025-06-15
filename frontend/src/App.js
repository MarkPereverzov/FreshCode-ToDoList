import React, { useState, useEffect } from 'react';
import './styles.css';

const API_URL = 'http://localhost:5000';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch(`${API_URL}/tasks`);
    const data = await res.json();
    setTasks(data);
  };

  const addTask = async () => {
    if (!title.trim()) return;
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    const newTask = await res.json();
    setTasks([...tasks, newTask]);
    setTitle('');
  };

  const toggleTask = async (id, currentStatus) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !currentStatus }),
      });

      if (response.ok) {
        setTasks(tasks.map(task =>
          task.id === id ? { ...task, completed: !currentStatus } : task
        ));
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="todo">
      <h2>ToDo List</h2>
      <input
        type="text"
        placeholder="Нове завдання"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={addTask}>Додати</button>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <label>
              <input
                type="checkbox"
                checked={!!task.completed}
                onChange={() => toggleTask(task.id, task.completed)}
              />
              <span className={task.completed ? 'completed' : ''}>
                {task.title}
              </span>
            </label>
            <button onClick={() => deleteTask(task.id)}>Видалити</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
