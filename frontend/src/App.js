import React, { useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({
    id: '',
    name: '',
    execution_time: '',
    deadline: '',
    priority: ''
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [message, setMessage] = useState('');
  const [results, setResults] = useState([]);

  const addTask = () => {
    if (taskForm.name && taskForm.execution_time && taskForm.deadline && taskForm.priority) {
      const newTask = {
        ...taskForm,
        id: Date.now()
      };
      setTasks([...tasks, newTask]);
      setMessage('Task added successfully!');
      setTaskForm({
        id: '',
        name: '',
        execution_time: '',
        deadline: '',
        priority: ''
      });
    } else {
      setMessage('Please fill in all fields.');
    }
  };

  const deleteTask = (id) => {
    const filteredTasks = tasks.filter(task => task.id !== id);
    setTasks(filteredTasks);
    setMessage('Task deleted successfully!');
  };

  const editTask = (task) => {
    setSelectedTask(task);
    setTaskForm({ ...task });
  };

  const updateTask = () => {
    const updatedTasks = tasks.map(task => task.id === selectedTask.id ? taskForm : task);
    setTasks(updatedTasks);
    setMessage('Task updated successfully!');
    setSelectedTask(null);
    setTaskForm({
      id: '',
      name: '',
      execution_time: '',
      deadline: '',
      priority: ''
    });
  };

  const sortTasks = () => {
    const sortedTasks = [...tasks].sort((a, b) => a.priority - b.priority);
    setTasks(sortedTasks);
  };

  const startScheduler = () => {
    const taskResults = tasks.map(task => {
      // Simulate task execution result
      return { id: task.id, name: task.name, status: 'Completed' };
    });
    setResults(taskResults);
  };

  return (
    <div className="App">
      <h1>RTOS Task Scheduler</h1>

      <div className="form-container">
        <input
          type="text"
          placeholder="Task Name"
          value={taskForm.name}
          onChange={(e) => setTaskForm({ ...taskForm, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Execution Time"
          value={taskForm.execution_time}
          onChange={(e) => setTaskForm({ ...taskForm, execution_time: e.target.value })}
        />
        <input
          type="number"
          placeholder="Deadline"
          value={taskForm.deadline}
          onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
        />
        <input
          type="number"
          placeholder="Priority"
          value={taskForm.priority}
          onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
        />
        <button onClick={addTask}>Add Task</button>
        {selectedTask && <button onClick={updateTask}>Update Task</button>}
        <button onClick={sortTasks}>Sort by Priority</button>
        <button onClick={startScheduler}>Start Scheduler</button>
      </div>

      {message && <div className="message">{message}</div>}

      <div className="task-list">
        <h2>Tasks</h2>
        <div className="table-box">
          <table>
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Execution Time</th>
                <th>Deadline</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td>{task.name}</td>
                  <td>{task.execution_time}</td>
                  <td>{task.deadline}</td>
                  <td>{task.priority}</td>
                  <td>
                    <button onClick={() => editTask(task)}>Edit</button>
                    <button onClick={() => deleteTask(task.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="result-list">
        <h2>Results</h2>
        <div className="table-box">
          <table>
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map(result => (
                <tr key={result.id}>
                  <td>{result.name}</td>
                  <td>{result.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
