import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Tasks.css';

function Tasks({ meeting, onBack }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  useEffect(() => {
    if (meeting) {
      loadTasks();
    }
  }, [meeting]);

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:5000/api/tasks/${meeting.MEETING_ID}`);
      setTasks(response.data);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    setUpdatingTaskId(taskId);
    try {
      await axios.post('http://localhost:5000/api/tasks/update', {
        taskId,
        newStatus
      });
      await loadTasks();
      setError('');
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task: ' + (err.response?.data?.error || err.message));
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const getNextStatus = (currentStatus) => {
    const statuses = ['pending', 'in-progress', 'completed'];
    const currentIndex = statuses.indexOf(currentStatus.toLowerCase());
    const nextIndex = (currentIndex + 1) % statuses.length;
    return statuses[nextIndex];
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h2>{meeting?.TITLE || 'Tasks'}</h2>
        <button className="refresh-btn" onClick={loadTasks} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="tasks-content">
        {tasks.length === 0 ? (
          <div className="no-tasks">
            <p>No tasks for this meeting</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <div key={task.TASK_ID} className={`task-card status-${task.STATUS}`}>
                <div className="task-header">
                  <h4>{task.TASK_TEXT}</h4>
                  <span className={`status-badge ${task.STATUS}`}>{task.STATUS}</span>
                </div>

                <div className="task-body">
                  <div className="task-info">
                    <div className="info-row">
                      <span className="label">Assigned to:</span>
                      <span className="value">{task.ASSIGNED_TO}</span>
                    </div>
                    {task.DEADLINE && (
                      <div className="info-row">
                        <span className="label">Deadline:</span>
                        <span className="value">
                          {new Date(task.DEADLINE).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="task-actions">
                  <select
                    className="status-select"
                    value={task.STATUS}
                    onChange={(e) => updateTaskStatus(task.TASK_ID, e.target.value)}
                    disabled={updatingTaskId === task.TASK_ID}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button
                    className="next-status-btn"
                    onClick={() => updateTaskStatus(task.TASK_ID, getNextStatus(task.STATUS))}
                    disabled={updatingTaskId === task.TASK_ID}
                  >
                    {updatingTaskId === task.TASK_ID ? 'Updating...' : 'Next Status'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Tasks;
