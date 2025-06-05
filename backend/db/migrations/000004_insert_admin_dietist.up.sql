INSERT INTO dietists (username, password, name)
VALUES ('admin', 'admin', 'Administrator')
ON CONFLICT DO NOTHING;
