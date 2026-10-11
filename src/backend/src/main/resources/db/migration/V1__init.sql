CREATE TABLE health_check (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW()
);