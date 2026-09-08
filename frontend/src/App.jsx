import React, { useState } from 'react';
import axios from 'axios';
import Upload from './components/Upload';
import Dashboard from './components/Dashboard';
import Tasks from './components/Tasks';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('upload');
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const handleMeetingCreated = async (meeting) => {
    console.log('Meeting created:', meeting);
    setSelectedMeeting(meeting);
    setCurrentPage('dashboard');
    await refreshMeetings();
  };

  const refreshMeetings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/meetings');
      setMeetings(response.data);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  const handleSelectMeeting = (meeting) => {
    setSelectedMeeting(meeting);
    setCurrentPage('dashboard');
  };

  const handleTasksPage = (meeting) => {
    setSelectedMeeting(meeting);
    setCurrentPage('tasks');
  };

  React.useEffect(() => {
    refreshMeetings();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>AI Meeting Intelligence System</h1>
        <nav className="app-nav">
          <button
            className={`nav-btn ${currentPage === 'upload' ? 'active' : ''}`}
            onClick={() => setCurrentPage('upload')}
          >
            Upload Meeting
          </button>
          <button
            className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentPage('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`nav-btn ${currentPage === 'tasks' ? 'active' : ''}`}
            onClick={() => setCurrentPage('tasks')}
          >
            Task Manager
          </button>
        </nav>
      </header>

      <main className="app-main">
        {currentPage === 'upload' && (
          <Upload onMeetingCreated={handleMeetingCreated} />
        )}

        {currentPage === 'dashboard' && (
          <Dashboard
            meetings={meetings}
            selectedMeeting={selectedMeeting}
            onSelectMeeting={handleSelectMeeting}
            onManageTasks={handleTasksPage}
          />
        )}

        {currentPage === 'tasks' && (
          <Tasks
            meeting={selectedMeeting}
            onBack={() => {
              setCurrentPage('dashboard');
            }}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 AI Meeting Intelligence System</p>
      </footer>
    </div>
  );
}

export default App;
