INSERT INTO dietists (first_name, surname, email, password)
VALUES ('Admin', 'Administrator', 'admin@example.com', 'admin')
ON CONFLICT DO NOTHING;
