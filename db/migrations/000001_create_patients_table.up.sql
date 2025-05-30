CREATE TABLE patients (
                          id SERIAL PRIMARY KEY,
                          username TEXT NOT NULL,
                          name TEXT NOT NULL,
                          created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
