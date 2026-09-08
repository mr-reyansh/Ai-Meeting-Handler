import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Upload.css';

function Upload({ onMeetingCreated }) {
  const [transcript, setTranscript] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!transcript || !title) {
        throw new Error('Please fill in both title and transcript');
      }

      const response = await axios.post('http://localhost:5000/api/meeting', {
        transcript,
        title,
        createdBy: 1
      });

      setSuccess('Meeting processed successfully!');
      setTranscript('');
      setTitle('');

      // Call parent callback
      if (onMeetingCreated) {
        onMeetingCreated(response.data);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.error || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h2>Upload Meeting Transcript</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Meeting Title</label>
            <input
              id="title"
              type="text"
              placeholder="Enter meeting title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="transcript">Meeting Transcript</label>
            <textarea
              id="transcript"
              placeholder="Paste the meeting transcript here..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows="12"
              disabled={loading}
            />
            <p className="char-count">{transcript.length} characters</p>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading || !transcript || !title}
          >
            {loading ? 'Processing...' : 'Process Meeting'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Upload;
