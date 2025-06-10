CREATE TABLE dishes (
    id SERIAL PRIMARY KEY,
    diet_id INT NOT NULL REFERENCES diets(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    calories INT NOT NULL,
    protein REAL NOT NULL,
    carbs REAL NOT NULL,
    fat REAL NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
