# Database

The running application uses SQLite. The backend creates and migrates its local tables in [`backend/db.js`](../backend/db.js), and the default database file is `backend/database.sqlite`.

The root [`schema.sql`](../schema.sql) is retained as the original Oracle SQL reference for the assignment. It is not used by the current SQLite runtime.