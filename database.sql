-- Database Export for FamilyBudget
-- Generated manually based on models.py

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(256) NOT NULL,
    persona VARCHAR(50) DEFAULT 'famille',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    plan_type VARCHAR(20) DEFAULT 'free',
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS goals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    goal_type VARCHAR(50) NOT NULL,
    target_amount DECIMAL(10, 2),
    is_enabled BOOLEAN DEFAULT TRUE
);

-- Example Data
INSERT INTO users (name, email, password_hash, persona) VALUES 
('Jean Dupont', 'jean@example.com', 'hashed_secret', 'parent_seul'),
('Marie Curie', 'marie@example.com', 'hashed_secret', 'famille');

INSERT INTO subscriptions (user_id, plan_type, is_active) VALUES
(1, 'free', TRUE),
(2, 'premium', TRUE);
