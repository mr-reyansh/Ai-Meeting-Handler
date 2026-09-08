# Setup Guide - Oracle Connection

## Prerequisites

You need:
1. Oracle Database 11g+ or Oracle XE (Express Edition - free)
2. SQL*Plus installed (comes with Oracle)
3. Node.js v16 or higher

## Step-by-Step Setup

### 1. Install Oracle Database XE (if not already installed)

**Windows:**
- Download Oracle Database XE from: https://www.oracle.com/database/technologies/xe-downloads.html
- Run installer, default password is what you set during installation
- Note down the port (typically 1521)
- Default SID: XE

### 2. Create Database Schema

```bash
# Connect to Oracle
sqlplus system/YOUR_PASSWORD@localhost:1521/XE

# Copy the entire content of schema.sql and paste it
# Or run:
@C:\path\to\schema.sql
```

If using default Oracle XE:
```bash
sqlplus system/oracle
```

### 3. Verify Tables Were Created

```sql
-- In SQL*Plus:
SELECT table_name FROM user_tables;
-- Should show: USERS, MEETINGS, TRANSCRIPTS, TASKS, DECISIONS, TASK_UPDATES

SELECT sequence_name FROM user_sequences;
-- Should show all 6 sequences

EXIT;
```

### 4. Backend Configuration

```bash
cd backend

# Create .env file
copy .env.example .env

# Edit .env with your Oracle credentials:
# DB_USER=system
# DB_PASSWORD=oracle (or your password)
# DB_CONNECT=localhost:1521/XE
# OPENAI_API_KEY=your-openai-api-key
```

### 5. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 6. Start Application

Terminal 1 (Backend):
```bash
cd backend
npm start
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

Open http://localhost:3000

## Connection Troubleshooting

### Error: "ORA-12514: TNS:listener does not currently know of service"

**Solution:**
1. Check Oracle listener is running
2. Verify SID/service name in .env
3. Try connecting with SQL*Plus first to test connection

### Error: "ECONNREFUSED - connection refused"

**Solution:**
1. Oracle service not running
2. Wrong port number (default 1521)
3. Firewall blocking connection

### Error: "ORA-01017: invalid username/password"

**Solution:**
1. Check DB_USER and DB_PASSWORD in .env
2. Default is: user=system, password=oracle
3. Verify you entered correct password during Oracle installation

## Oracle Express Edition (XE) Notes

- Default user: system
- Default password: oracle (or what you set)
- Default SID: XE
- Port: 1521 (default)
- No license needed, perfect for development

## Create Initial User (Optional)

```sql
-- As system user:
CREATE USER meeting_app IDENTIFIED BY password;
GRANT CREATE SESSION TO meeting_app;
GRANT CREATE TABLE TO meeting_app;
GRANT CREATE SEQUENCE TO meeting_app;
COMMIT;

-- Then update .env:
# DB_USER=meeting_app
# DB_PASSWORD=password
```

## Verify Connection from Node.js

```bash
cd backend
node -e "require('./db').initializePool().then(() => console.log('Connected!')).catch(e => console.error(e))"
```

## Test Database

After setup, run this query to verify data:

```bash
# In SQL*Plus
SELECT * FROM meetings;  -- Should return rows after creating meeting
SELECT * FROM tasks WHERE meeting_id = 1;
SELECT * FROM task_updates ORDER BY updated_at DESC;
```

## Common Issues

| Problem | Solution |
|---------|----------|
| Can't connect to DB | Check Oracle service running: `sqlplus system/oracle` first |
| "listener does not know service" | Verify `:1521/XE` matches your setup |
| Sequences don't exist | Run schema.sql again |
| Tasks won't insert | Check meeting_id exists in meetings table |

## Production Considerations

- Use strong passwords
- Set up proper Oracle user (not system)
- Enable audit logging
- Set up backups
- Use connection pool with appropriate size
- Configure tablespace quotas per user

---

For more help:
- Oracle Docs: https://docs.oracle.com/
- oracledb npm: https://github.com/oracle/node-oracledb
