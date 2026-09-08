# Development Guide

## Running in Development Mode

### Backend Development

```bash
cd backend

# Install dependencies (first time only)
npm install

# Start with auto-reload
npm run dev

# Or regular start (no auto-reload)
npm start
```

**Port**: 5000
**Features**: Hot reload with nodemon

### Frontend Development

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start dev server with hot reload
npm run dev
```

**Port**: 3000
**Features**: Hot module replacement (HMR), fast refresh

## API Testing

### Using curl:

```bash
# Test server health
curl http://localhost:5000/

# Create meeting
curl -X POST http://localhost:5000/api/meeting \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Q1 Planning",
    "transcript": "John: Let'\''s plan Q1. Sarah: We need backend by Jan 15. John: And API docs.",
    "createdBy": 1
  }'

# List meetings
curl http://localhost:5000/api/meetings

# Get tasks for meeting 1
curl http://localhost:5000/api/tasks/1

# Update task status
curl -X POST http://localhost:5000/api/tasks/update \
  -H "Content-Type: application/json" \
  -d '{"taskId": 1, "newStatus": "completed"}'

# Get decisions for meeting 1
curl http://localhost:5000/api/decisions/1
```

### Using Postman:

1. Import the endpoints as shown in curl examples
2. Set Content-Type to application/json
3. Test each route

## Database Queries

### Monitor ongoing operations:

```sql
-- View active sessions
SELECT username, sid, serial#, status FROM v$session;

-- View recent queries
SELECT sql_text FROM v$sqlarea LIMIT 10;

-- View table sizes
SELECT table_name, num_rows FROM user_tables;

-- View index usage
SELECT index_name, table_name FROM user_indexes;
```

### Debug data:

```sql
-- Check meetings
SELECT * FROM meetings ORDER BY meeting_id DESC;

-- Check tasks with meetings
SELECT t.task_id, t.task_text, t.status, m.title
FROM tasks t
JOIN meetings m ON t.meeting_id = m.meeting_id;

-- Check task history
SELECT tu.*, t.task_text
FROM task_updates tu
JOIN tasks t ON tu.task_id = t.task_id
ORDER BY tu.updated_at DESC;

-- Check decisions
SELECT d.*, m.title
FROM decisions d
JOIN meetings m ON d.meeting_id = m.meeting_id;
```

## Code Structure

### Backend:

- `server.js` - Express app setup, middleware, routes binding
- `db.js` - Connection pool, query executors
- `routes.js` - API endpoints, business logic
- `ai.js` - OpenAI integration, data extraction

### Frontend:

- `App.jsx` - Main navigation, page switching
- `components/Upload.jsx` - Transcript upload form
- `components/Dashboard.jsx` - Meeting list and details
- `components/Tasks.jsx` - Task management interface
- `styles/` - Component-specific CSS

## Adding Features

### Add a new API route:

```javascript
// In routes.js
router.get('/api/new-endpoint', async (req, res) => {
  try {
    const result = await executeQuery('SELECT ...', []);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Add a new React component:

```jsx
// In frontend/src/components/NewComponent.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function NewComponent() {
  const [data, setData] = useState([]);
  
  // Component logic
  
  return <div>{/* JSX */}</div>;
}
```

## Performance Testing

### Load test the API:

```bash
# Install ab (Apache Bench)
# Windows: Download or use npm install -g autocannon

npx autocannon -c 10 -d 10 http://localhost:5000/api/meetings
```

### Database query performance:

```sql
-- Check execution plan
EXPLAIN PLAN FOR
SELECT * FROM meetings WHERE meeting_id = 1;
SELECT * FROM TABLE(dbms_xplan.display);

-- Check statistics
SET AUTOTRACE ON;
SELECT ...query...;
SET AUTOTRACE OFF;
```

## Dependencies

### Backend:
- **express** - Web framework
- **axios** - HTTP client for OpenAI
- **oracledb** - Oracle database driver
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **nodemon** - Dev auto-reload

### Frontend:
- **react** - UI framework
- **axios** - HTTP client
- **vite** - Build tool

## Debugging

### Backend:

```javascript
// Add console logging
console.log('Query:', sql);
console.log('Params:', params);
console.log('Result:', result);

// Enable detailed error messages
try {
  // ...
} catch (error) {
  console.error('Full error:', error);
  console.error('Stack:', error.stack);
}
```

### Frontend:

```javascript
// Use React DevTools
// Chrome: Install React Developer Tools extension

// Console debugging
console.log('Component state:', data);
console.log('API response:', response.data);

// Network tab
// Open DevTools → Network → Check API calls
```

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| "ORA-01400: cannot insert NULL" | Missing required column | Check all NOT NULL columns have values |
| "Cannot read property of undefined" | Null response from API | Check database query returns data |
| "CORS error" | Frontend/backend mismatch | Check URLs in frontend match backend port |
| "EADDRINUSE: address in use" | Port already taken | Kill process or change PORT env var |

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Commit changes
git add .
git commit -m "Add new feature"

# Push and create PR
git push origin feature/new-feature
```

## Environment Variables

Create `.env` files:

**Backend (.env):**
```
DB_USER=system
DB_PASSWORD=oracle
DB_CONNECT=localhost:1521/XE
OPENAI_API_KEY=sk-xxx...
PORT=5000
NODE_ENV=development
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000/api
```

## Resources

- [Express Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [Oracle Database Docs](https://docs.oracle.com/)
- [oracledb Driver Docs](https://github.com/oracle/node-oracledb)
- [Vite Docs](https://vitejs.dev/)
