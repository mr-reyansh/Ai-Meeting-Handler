# Project Structure

```text
.
├── backend/
│   ├── ai.js                  OpenAI extraction client
│   ├── db.js                  SQLite initialization and query helpers
│   ├── routes.js              Express API routes
│   ├── server.js              HTTP server and middleware
│   ├── Dockerfile             Backend container image
│   ├── package.json           Backend scripts and dependencies
│   └── .env.example           Environment variable template
├── frontend/
│   ├── src/
│   │   ├── App.jsx            Main navigation and page state
│   │   ├── main.jsx           React entry point
│   │   ├── components/        Upload, dashboard, and task workflows
│   │   └── styles/            Component stylesheets
│   ├── Dockerfile              Frontend container image
│   ├── index.html              Vite HTML entry point
│   ├── package.json            Frontend scripts and dependencies
│   └── vite.config.js          Dev server and API proxy configuration
├── database/
│   └── README.md               Runtime database notes
├── design/
│   ├── architecture/          Draw.io source and PNG deliverables
│   ├── figma/                  Six final screen exports
│   └── README.md               Assignment deliverable checklist
├── docker-compose.yml          Frontend/backend local services
├── schema.sql                  Original Oracle SQL reference
├── .gitignore                  Local, generated, and secret files
└── README.md                   Project and software design documentation
```

## Runtime Flow

1. The React/Vite frontend submits transcripts and requests data through the REST API.
2. Express routes validate requests and coordinate the workflow.
3. `ai.js` sends transcript text to the OpenAI API and parses structured output.
4. `db.js` stores meetings, transcripts, tasks, decisions, and task update history in SQLite.
5. The frontend displays meetings and allows task status updates.

The active database implementation is SQLite. The root `schema.sql` is retained as the original Oracle reference and is not executed by the current backend.
