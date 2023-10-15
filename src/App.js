import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import './App.css';

function App() {
  const [dailyTasks, setDailyTasks] = useState([{ text: '', completed: false, editing: false }]);
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [dailyTaskInput, setDailyTaskInput] = useState('');
  const [todaysTaskInput, setTodaysTaskInput] = useState('');

  const handleEditTaskClick = (index) => {
    const updatedTasks = [...dailyTasks];
    updatedTasks[index].editing = !updatedTasks[index].editing;
    setDailyTasks(updatedTasks);
  };

  const handleEditTask = (index, newText) => {
    const updatedTasks = [...dailyTasks];
    updatedTasks[index].text = newText;
    updatedTasks[index].editing = false;
    setDailyTasks(updatedTasks);
  };

  const handleEditTaskChange = (index, newText) => {
    const updatedTasks = [...dailyTasks];
    updatedTasks[index].text = newText;
    setDailyTasks(updatedTasks);
  };

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
      const newTask = { text: dailyTaskInput, completed: false };
      const updatedTasks = [...dailyTasks, newTask];
      setDailyTasks(updatedTasks);
      saveDailyTasksToFile(updatedTasks);
      setDailyTaskInput('');
    }
  };
  
  const handleRemoveDailyTask = (index) => {
    const updatedTasks = [...dailyTasks];
    updatedTasks.splice(index, 1);
    setDailyTasks(updatedTasks);
    saveDailyTasksToFile(updatedTasks);
  };
  
  const saveDailyTasksToFile = (tasks) => {
    try {
      // Convert the tasks to the desired format (array of strings)
      const formattedTasks = tasks.map((task) => task.text);
      // Save the formatted tasks to the file
      window.electronAPI.saveFile(formattedTasks)
    } catch (error) {
      console.error('Error saving daily tasks:', error);
    }
  };

  const handleAddTodaysTask = (event) => {
    event.preventDefault();
    if (todaysTaskInput.trim() !== '') {
      setTodaysTasks([...todaysTasks, { text: todaysTaskInput, completed: false }]);
      setTodaysTaskInput('');
    }
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

  const moveTaskUp = (index) => {
    if (index === 0) return; // Task is already at the top
    const updatedTasks = [...dailyTasks];
    const temp = updatedTasks[index];
    updatedTasks[index] = updatedTasks[index - 1];
    updatedTasks[index - 1] = temp;
    setDailyTasks(updatedTasks);
  };
  
  const moveTaskDown = (index) => {
    if (index === dailyTasks.length - 1) return; // Task is already at the bottom
    const updatedTasks = [...dailyTasks];
    const temp = updatedTasks[index];
    updatedTasks[index] = updatedTasks[index + 1];
    updatedTasks[index + 1] = temp;
    setDailyTasks(updatedTasks);
  };

  return (
    <div className='outer'>
      {/* <button onClick={() => handleSF()} type="button" id="btn">Save to File</button> */}
      <div className='daily'>
        <h2>Daily Task</h2>
        <ul className='tasklist'>
          {dailyTasks.map((task, index) => (
            <li key={index} className={task.completed ? 'completed' : ''}>
              <button onClick={() => moveTaskUp(index)}><ArrowUpwardIcon fontSize="small" /></button>
              <button onClick={() => moveTaskDown(index)}><ArrowDownwardIcon fontSize="small" /></button>
              <input
                type='checkbox'
                checked={task.completed}
                onChange={() => handleToggleDailyTask(index)}
              />
              {task.editing ? (
                <input
                  type="text"
                  value={task.text}
                  onChange={(e) => handleEditTaskChange(index, e.target.value)}
                />
              ) : (
                task.text
              )}
              <div className="right-buttons">
                <button onClick={() => handleEditTaskClick(index)}><EditIcon fontSize="small" /></button>
                <button onClick={() => handleRemoveDailyTask(index)}><ClearIcon fontSize="small" /></button>
              </div>
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
