// Routes for Meeting Intelligence API
const express = require('express');
const router = express.Router();
const { extractMeetingData } = require('./ai');
const { executeQuery, executeUpdate } = require('./db');

// POST /meeting - Create meeting from transcript
router.post('/meeting', async (req, res) => {
  try {
    const { transcript, title, createdBy } = req.body;

    if (!transcript || !title) {
      return res.status(400).json({ error: 'Transcript and title are required' });
    }

    // Step 1: Extract data using AI
    console.log('Extracting meeting data from transcript...');
    const { summary, tasks, decisions } = await extractMeetingData(transcript);

    // Step 2: Insert meeting
    const meetingResult = await executeUpdate(
      `INSERT INTO meetings (title, created_by, summary)
       VALUES (?, ?, ?)`,
      [title, createdBy || 1, summary]
    );

    const meetingId = meetingResult.lastID;
    console.log(`Meeting created with ID: ${meetingId}`);

    // Step 3: Insert transcript
    await executeUpdate(
      `INSERT INTO transcripts (meeting_id, content)
       VALUES (?, ?)`,
      [meetingId, transcript]
    );
    console.log('Transcript inserted');

    // Step 4: Insert tasks
    const insertedTasks = [];
    for (const task of tasks) {
      const taskResult = await executeUpdate(
        `INSERT INTO tasks (meeting_id, task_text, assigned_to, status)
         VALUES (?, ?, ?, 'pending')`,
        [meetingId, task.task, task.assigned_to]
      );
      insertedTasks.push({
        task_id: taskResult.lastID,
        task: task.task,
        assigned_to: task.assigned_to,
        status: 'pending'
      });
    }
    console.log(`${insertedTasks.length} tasks inserted`);

    // Step 5: Insert decisions
    const insertedDecisions = [];
    for (const decision of decisions) {
      const decisionResult = await executeUpdate(
        `INSERT INTO decisions (meeting_id, decision_text)
         VALUES (?, ?)`,
        [meetingId, decision]
      );
      insertedDecisions.push({
        decision_id: decisionResult.lastID,
        decision: decision
      });
    }
    console.log(`${insertedDecisions.length} decisions inserted`);

    res.json({
      success: true,
      meeting_id: meetingId,
      title: title,
      summary: summary,
      tasks: insertedTasks,
      decisions: insertedDecisions
    });
  } catch (error) {
    console.error('Error in POST /meeting:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /meetings - Get all meetings
router.get('/meetings', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT m.meeting_id, m.title, m.meeting_date, m.created_by, m.summary,
             COUNT(DISTINCT t.task_id) as task_count,
             COUNT(DISTINCT d.decision_id) as decision_count
      FROM meetings m
      LEFT JOIN tasks t ON m.meeting_id = t.meeting_id
      LEFT JOIN decisions d ON m.meeting_id = d.meeting_id
      GROUP BY m.meeting_id, m.title, m.meeting_date, m.created_by, m.summary
      ORDER BY m.meeting_date DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error in GET /meetings:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /tasks/:meetingId - Get tasks for a meeting
router.get('/tasks/:meetingId', async (req, res) => {
  try {
    const { meetingId } = req.params;

    const result = await executeQuery(
      `SELECT task_id, meeting_id, task_text, assigned_to, deadline, status
       FROM tasks
       WHERE meeting_id = ?
       ORDER BY task_id DESC`,
      [meetingId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error in GET /tasks/:meetingId:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /tasks/update - Update task status
router.post('/tasks/update', async (req, res) => {
  try {
    const { taskId, newStatus } = req.body;

    if (!taskId || !newStatus) {
      return res.status(400).json({ error: 'taskId and newStatus are required' });
    }

    // Get old status
    const oldStatusResult = await executeQuery(
      `SELECT status FROM tasks WHERE task_id = ?`,
      [taskId]
    );

    if (oldStatusResult.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const oldStatus = oldStatusResult.rows[0].STATUS;

    // Update task status
    await executeUpdate(
      `UPDATE tasks SET status = ? WHERE task_id = ?`,
      [newStatus, taskId]
    );

    // Insert into task_updates
    const updateResult = await executeUpdate(
      `INSERT INTO task_updates (task_id, old_status, new_status)
       VALUES (?, ?, ?)`,
      [taskId, oldStatus, newStatus]
    );

    res.json({
      success: true,
      update_id: updateResult.lastID,
      task_id: taskId,
      old_status: oldStatus,
      new_status: newStatus
    });
  } catch (error) {
    console.error('Error in POST /tasks/update:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /decisions/:meetingId - Get decisions for a meeting
router.get('/decisions/:meetingId', async (req, res) => {
  try {
    const { meetingId } = req.params;

    const result = await executeQuery(
      `SELECT decision_id, meeting_id, decision_text
       FROM decisions
       WHERE meeting_id = ?
       ORDER BY decision_id DESC`,
      [meetingId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error in GET /decisions/:meetingId:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /meeting/:meetingId - Get meeting details
router.get('/meeting/:meetingId', async (req, res) => {
  try {
    const { meetingId } = req.params;

    const result = await executeQuery(
      `SELECT meeting_id, title, meeting_date, created_by, summary
       FROM meetings
       WHERE meeting_id = ?`,
      [meetingId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error in GET /meeting/:meetingId:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
