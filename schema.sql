-- Oracle SQL Schema for AI Meeting Intelligence System

-- Create Sequences
CREATE SEQUENCE users_seq
  START WITH 1
  INCREMENT BY 1
  NOCYCLE;

CREATE SEQUENCE meetings_seq
  START WITH 1
  INCREMENT BY 1
  NOCYCLE;

CREATE SEQUENCE transcripts_seq
  START WITH 1
  INCREMENT BY 1
  NOCYCLE;

CREATE SEQUENCE tasks_seq
  START WITH 1
  INCREMENT BY 1
  NOCYCLE;

CREATE SEQUENCE decisions_seq
  START WITH 1
  INCREMENT BY 1
  NOCYCLE;

CREATE SEQUENCE task_updates_seq
  START WITH 1
  INCREMENT BY 1
  NOCYCLE;

-- Create Tables

CREATE TABLE users (
  user_id NUMBER PRIMARY KEY,
  name VARCHAR2(100),
  email VARCHAR2(100)
);

CREATE TABLE meetings (
  meeting_id NUMBER PRIMARY KEY,
  title VARCHAR2(255),
  meeting_date DATE DEFAULT SYSDATE,
  created_by NUMBER,
  summary CLOB,
  FOREIGN KEY (created_by) REFERENCES users(user_id)
);

CREATE TABLE transcripts (
  transcript_id NUMBER PRIMARY KEY,
  meeting_id NUMBER,
  content CLOB,
  FOREIGN KEY (meeting_id) REFERENCES meetings(meeting_id)
);

CREATE TABLE tasks (
  task_id NUMBER PRIMARY KEY,
  meeting_id NUMBER,
  task_text CLOB,
  assigned_to VARCHAR2(100),
  deadline DATE,
  status VARCHAR2(50) DEFAULT 'pending',
  FOREIGN KEY (meeting_id) REFERENCES meetings(meeting_id)
);

CREATE TABLE decisions (
  decision_id NUMBER PRIMARY KEY,
  meeting_id NUMBER,
  decision_text CLOB,
  FOREIGN KEY (meeting_id) REFERENCES meetings(meeting_id)
);

CREATE TABLE task_updates (
  update_id NUMBER PRIMARY KEY,
  task_id NUMBER,
  old_status VARCHAR2(50),
  new_status VARCHAR2(50),
  updated_at DATE DEFAULT SYSDATE,
  FOREIGN KEY (task_id) REFERENCES tasks(task_id)
);

-- Create Indexes for better query performance
CREATE INDEX idx_meetings_created_by ON meetings(created_by);
CREATE INDEX idx_transcripts_meeting ON transcripts(meeting_id);
CREATE INDEX idx_tasks_meeting ON tasks(meeting_id);
CREATE INDEX idx_decisions_meeting ON decisions(meeting_id);
CREATE INDEX idx_task_updates_task ON task_updates(task_id);
