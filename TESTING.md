# Testing Guide

## Manual Testing

### 1. Test Backend Server

```bash
# Start backend
cd backend
npm start

# In another terminal, test endpoints:
curl http://localhost:5000/
```

Expected response:
```json
{"message":"AI Meeting Intelligence API is running"}
```

### 2. Test Database Connection

```bash
cd backend
node -e "
require('dotenv').config();
const db = require('./db');
db.initializePool()
  .then(() => {
    console.log('✅ Database connected');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Database error:', err.message);
    process.exit(1);
  });
"
```

### 3. Test API Endpoints

#### Create a Meeting

```bash
curl -X POST http://localhost:5000/api/meeting \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Product Planning",
    "transcript": "Alice: We need to launch the new dashboard. Bob: Thats due January 15. Alice: John will handle the backend. Bob: Agreed. We will launch on January 20.",
    "createdBy": 1
  }'
```

Expected response:
```json
{
  "success": true,
  "meeting_id": 1,
  "summary": "...",
  "tasks": [...],
  "decisions": [...]
}
```

#### Get All Meetings

```bash
curl http://localhost:5000/api/meetings
```

#### Get Tasks for Meeting

```bash
curl http://localhost:5000/api/tasks/1
```

#### Update Task Status

```bash
curl -X POST http://localhost:5000/api/tasks/update \
  -H "Content-Type: application/json" \
  -d '{"taskId": 1, "newStatus": "in-progress"}'
```

#### Get Decisions

```bash
curl http://localhost:5000/api/decisions/1
```

### 4. Test Frontend

```bash
cd frontend
npm run dev

# Open http://localhost:3000 in browser
```

Test steps:
1. Upload → Tab visible with form
2. Upload → Enter data and submit
3. Dashboard → See meeting appears
4. Dashboard → Click meeting and see details
5. Task Manager → Click button from dashboard
6. Task Manager → Change task status
7. Task Manager → Update persists on refresh

### 5. Database Verification

```sql
-- Connect to Oracle
sqlplus system/oracle

-- Verify all tables have data
SELECT COUNT(*) as meeting_count FROM meetings;
SELECT COUNT(*) as task_count FROM tasks;
SELECT COUNT(*) as decision_count FROM decisions;
SELECT COUNT(*) as update_count FROM task_updates;

-- Check task history
SELECT t.task_id, t.task_text, tu.old_status, tu.new_status, tu.updated_at
FROM task_updates tu
JOIN tasks t ON tu.task_id = t.task_id
ORDER BY tu.updated_at DESC;

-- Exit
EXIT;
```

## Automated Testing (Example)

Create `backend/test.js`:

```javascript
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('Starting API tests...');

  // Test 1: Create meeting
  try {
    const res = await axios.post(`${API_URL}/meeting`, {
      title: 'Test Meeting',
      transcript: 'John: Lets ship it. Sarah: Great idea.',
      createdBy: 1
    });
    console.log('✅ POST /meeting');
    const meetingId = res.data.meeting_id;

    // Test 2: Get meetings
    const meetings = await axios.get(`${API_URL}/meetings`);
    console.log('✅ GET /meetings');

    // Test 3: Get tasks
    const tasks = await axios.get(`${API_URL}/tasks/${meetingId}`);
    console.log('✅ GET /tasks/:id');

    // Test 4: Update task
    if (tasks.data.length > 0) {
      await axios.post(`${API_URL}/tasks/update`, {
        taskId: tasks.data[0].TASK_ID,
        newStatus: 'completed'
      });
      console.log('✅ POST /tasks/update');
    }

    // Test 5: Get decisions
    const decisions = await axios.get(`${API_URL}/decisions/${meetingId}`);
    console.log('✅ GET /decisions/:id');

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();
```

Run with: `node test.js`

## Performance Testing

### Load Test with autocannon

```bash
npm install -g autocannon

# Test /meetings endpoint
autocannon -c 10 -d 10 http://localhost:5000/api/meetings

# Test /tasks endpoint
autocannon -c 10 -d 10 http://localhost:5000/api/tasks/1
```

### Memory Leak Test

Monitor Node.js process:
```bash
# In one terminal
node --inspect server.js

# In another terminal
node --inspect-brk ./node_modules/.bin/clinic doctor -- node server.js
```

## UI/UX Testing

### Browser Testing

- Test in Chrome, Firefox, Safari
- Test mobile view (DevTools)
- Test with long text inputs
- Test rapid clicks
- Test refresh during processing

### Scenarios

| Scenario | Steps | Expected |
|----------|-------|----------|
| Empty submission | Submit empty form | Error message |
| Long transcript | Paste 10KB transcript | Processes successfully |
| Duplicate title | Create same title twice | Different meeting_id |
| Update same task twice | Quick status changes | Latest status saved |
| Rapid uploads | Create 5 meetings quickly | All created without errors |

## Error Testing

### Database Error
- Stop Oracle service
- Try to create meeting
- Should show connection error

### OpenAI Error
- Use invalid API key
- Try to create meeting
- Should show API error

### Network Error
- Disable internet
- Try to create meeting
- Should timeout gracefully

## Regression Testing

After changes, verify:

1. Meeting creation works
2. All meetings appear in list
3. Tasks show correct count
4. Decisions display correctly
5. Task status updates persist
6. History records in task_updates

---

Use these tests to verify the application works correctly before deployment.
