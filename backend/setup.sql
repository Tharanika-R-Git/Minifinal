-- PostgreSQL Database Setup for Dashboard Builder
-- Run this script to set up your database

-- Create database (run this as postgres superuser)
-- CREATE DATABASE dashboard_builder;

-- Connect to the database and run the following:

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dashboards table
CREATE TABLE IF NOT EXISTS dashboards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    layout JSONB DEFAULT '[]',
    widgets JSONB DEFAULT '{}',
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_dashboards_user_id ON dashboards(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboards_updated_at ON dashboards(updated_at);

-- Insert sample data (optional)
-- INSERT INTO users (email, password, name) VALUES 
-- ('demo@example.com', '$2a$10$example_hashed_password', 'Demo User');

COMMENT ON TABLE users IS 'User accounts for dashboard access';
COMMENT ON TABLE dashboards IS 'User-created dashboards with layout and widget configurations';