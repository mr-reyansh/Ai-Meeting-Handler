import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

function Dashboard({ meetings, selectedMeeting, onSelectMeeting, onManageTasks }) {
  const [currentMeeting, setCurrentMeeting] = useState(selectedMeeting);
  const [tasks, setTasks] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentMeeting) {
      loadMeetingDetails(currentMeeting.MEETING_ID);
    }
  }, [currentMeeting]);

  useEffect(() => {
    if (selectedMeeting) {
      setCurrentMeeting(selectedMeeting);
    }
  }, [selectedMeeting]);

  const loadMeetingDetails = async (meetingId) => {
    setLoading(true);
    setError('');
    try {
      const [tasksRes, decisionsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/tasks/${meetingId}`),
        axios.get(`http://localhost:5000/api/decisions/${meetingId}`)
      ]);
      setTasks(tasksRes.data);
      setDecisions(decisionsRes.data);
    } catch (err) {
      console.error('Error loading details:', err);
      setError('Failed to load meeting details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-layout">
        {/* Meetings List */}
        <aside className="meetings-list">
          <h3>Recent Meetings</h3>
          <ul className="meetings">
            {meetings.length === 0 ? (
              <li className="no-meetings">No meetings yet</li>
            ) : (
              meetings.map((meeting) => (
                <li
                  key={meeting.MEETING_ID}
                  className={`meeting-item ${
                    currentMeeting?.MEETING_ID === meeting.MEETING_ID ? 'active' : ''
                  }`}
                  onClick={() => {
                    setCurrentMeeting(meeting);
                    onSelectMeeting(meeting);
                  }}
                >
                  <div className="meeting-title">{meeting.TITLE}</div>
                  <div className="meeting-meta">
                    <span>{meeting.TASK_COUNT || 0} tasks</span>
                    <span>{meeting.DECISION_COUNT || 0} decisions</span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </aside>

        {/* Meeting Details */}
        <section className="meeting-details">
          {currentMeeting ? (
            <div>
              <h2>{currentMeeting.TITLE}</h2>
              <p className="meeting-date">
                {new Date(currentMeeting.MEETING_DATE).toLocaleDateString()}
              </p>

              {error && <div className="error-message">{error}</div>}
              {loading && <div className="loading">Loading details...</div>}

              {/* Summary */}
              <div className="section">
                <h3>Summary</h3>
                <div className="summary-box">
                  {currentMeeting.SUMMARY || 'No summary available'}
                </div>
              </div>

              {/* Tasks */}
              <div className="section">
                <div className="section-header">
                  <h3>Tasks ({tasks.length})</h3>
                  <button
                    className="manage-btn"
                    onClick={() => onManageTasks(currentMeeting)}
                  >
                    Manage Tasks
                  </button>
                </div>
                {tasks.length === 0 ? (
                  <p className="no-data">No tasks for this meeting</p>
                ) : (
                  <ul className="items-list">
                    {tasks.map((task) => (
                      <li key={task.TASK_ID} className={`task-item status-${task.STATUS}`}>
                        <div className="item-text">{task.TASK_TEXT}</div>
                        <div className="item-meta">
                          <span className="assigned">Assigned: {task.ASSIGNED_TO}</span>
                          <span className={`status ${task.STATUS}`}>{task.STATUS}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Decisions */}
              <div className="section">
                <h3>Decisions ({decisions.length})</h3>
                {decisions.length === 0 ? (
                  <p className="no-data">No decisions for this meeting</p>
                ) : (
                  <ul className="items-list">
                    {decisions.map((decision) => (
                      <li key={decision.DECISION_ID} className="decision-item">
                        <div className="item-text">{decision.DECISION_TEXT}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <p>Select a meeting to view details</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
