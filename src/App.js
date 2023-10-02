import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [dailyTasks, setDailyTasks] = useState([]);
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [dailyTaskInput, setDailyTaskInput] = useState('');
  const [todaysTaskInput, setTodaysTaskInput] = useState('');

  // Function to load daily tasks from a file
  const loadDailyTasksFromFile = async () => {
    try {
      await window.electronAPI.openFile();
      window.electronAPI.haveData((_event, data) => {
        var newData = JSON.parse(data);
        const formattedTasks = newData.tasks.map((task) => ({
          text: task,
          completed: false,
        }));
        setDailyTasks(formattedTasks);
      });
    } catch (error) {
      console.error('Error loading daily tasks:', error);
    }
  };

  useEffect(() => {
    loadDailyTasksFromFile(); // Load daily tasks when the component mounts
  }, []);

  const handleAddDailyTask = (event) => {
    event.preventDefault();
    if (dailyTaskInput.trim() !== '') {
      setDailyTasks([...dailyTasks, { text: dailyTaskInput, completed: false }]);
      setDailyTaskInput('');
    }
  };

  const handleAddTodaysTask = (event) => {
    event.preventDefault();
    if (todaysTaskInput.trim() !== '') {
      setTodaysTasks([...todaysTasks, { text: todaysTaskInput, completed: false }]);
      setTodaysTaskInput('');
    }
  };

  const handleRemoveDailyTask = (index) => {
    const updatedTasks = [...dailyTasks];
    updatedTasks.splice(index, 1);
    setDailyTasks(updatedTasks);
  };

  const handleRemoveTodaysTask = (index) => {
    const updatedTasks = [...todaysTasks];
    updatedTasks.splice(index, 1);
    setTodaysTasks(updatedTasks);
  };

  const handleToggleDailyTask = (index) => {
    const updatedTasks = [...dailyTasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setDailyTasks(updatedTasks);
  };

  const handleToggleTodaysTask = (index) => {
    const updatedTasks = [...todaysTasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTodaysTasks(updatedTasks);
  };

  const handleSF = async () => {
    await window.electronAPI.saveFile(dailyTasks);
  }

  return (
    <div className='outer'>
      <button onClick={() => handleSF()} type="button" id="btn">Save to File</button>
      <div className='daily'>
        <h2>Daily Tasks</h2>
        <ul className='tasklist'>
          {dailyTasks.map((task, index) => (
            <li key={index} className={task.completed ? 'completed' : ''}>
              <input
                type='checkbox'
                checked={task.completed}
                onChange={() => handleToggleDailyTask(index)}
              />
              {task.text}
              <button onClick={() => handleRemoveDailyTask(index)}>X</button>
            </li>
          ))}
        </ul>
        <form onSubmit={handleAddDailyTask}>
          <input
            type='text'
            placeholder='Add a daily task'
            value={dailyTaskInput}
            onChange={(e) => setDailyTaskInput(e.target.value)}
          />
        </form>
      </div>

      <div className='today'>
        <h2>Today's Tasks</h2>
        <ul className='tasklist'>
          {todaysTasks.map((task, index) => (
            <li key={index} className={task.completed ? 'completed' : ''}>
              <input
                type='checkbox'
                checked={task.completed}
                onChange={() => handleToggleTodaysTask(index)}
              />
              {task.text}
              <button onClick={() => handleRemoveTodaysTask(index)}>X</button>
            </li>
          ))}
        </ul>
        <form onSubmit={handleAddTodaysTask}>
          <input
            type='text'
            placeholder="Add today's task"
            value={todaysTaskInput}
            onChange={(e) => setTodaysTaskInput(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
}

export default App;
