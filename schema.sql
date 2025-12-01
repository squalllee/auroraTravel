-- Drop existing tables and types if they exist to ensure a clean slate
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS itinerary_items;
DROP TABLE IF EXISTS days;
DROP TYPE IF EXISTS item_type_enum;

-- Enable UUID extension if we want to use auto-generated IDs in the future, 
-- though currently we use string IDs from the frontend.
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define the Enum type for Itinerary Item Types
CREATE TYPE item_type_enum AS ENUM (
    'FLIGHT',
    'TRAIN',
    'HOTEL',
    'ACTIVITY',
    'CAR_RENTAL',
    'INFO'
);

-- Table for Daily Schedules
CREATE TABLE days (
    id VARCHAR(50) PRIMARY KEY, -- e.g., 'day1'
    date_str DATE NOT NULL,     -- e.g., '2026-02-18'
    day_label VARCHAR(50) NOT NULL, -- e.g., 'Day 1'
    location VARCHAR(255) NOT NULL  -- e.g., '越南胡志明 🇻🇳'
);

-- Table for Itinerary Items
CREATE TABLE itinerary_items (
    id VARCHAR(50) PRIMARY KEY, -- e.g., 'd1-1'
    day_id VARCHAR(50) NOT NULL REFERENCES days(id) ON DELETE CASCADE,
    
    start_time VARCHAR(10),     -- e.g., '10:20'. stored as string to be flexible
    duration VARCHAR(50),       -- e.g., '1小時'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    item_type item_type_enum NOT NULL,
    
    price VARCHAR(50),          -- e.g., '9,003 TWD'. Stored as string to include currency/text
    link TEXT,                  -- URL
    image_url TEXT,             -- URL to image thumbnail
    
    -- Optional location fields if needed in the future
    location_query VARCHAR(255),
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    
    -- Sort order for custom ordering (e.g., from route optimization)
    sort_order INTEGER,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on day_id for faster lookups of items by day
CREATE INDEX idx_itinerary_items_day_id ON itinerary_items(day_id);

-- Comments for documentation
COMMENT ON TABLE days IS 'Stores the daily schedule summary';
COMMENT ON TABLE itinerary_items IS 'Stores individual events/items within a day';

-- Table for Expenses
CREATE TABLE expenses (
    id VARCHAR(50) PRIMARY KEY,
    day_id VARCHAR(50) NOT NULL REFERENCES days(id) ON DELETE CASCADE,
    item_id VARCHAR(50) REFERENCES itinerary_items(id) ON DELETE SET NULL,
    
    category VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL, -- TWD amount
    currency VARCHAR(10) NOT NULL DEFAULT 'TWD',
    original_amount DECIMAL(10, 2),
    original_currency VARCHAR(10),
    description TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on day_id for faster lookups
CREATE INDEX idx_expenses_day_id ON expenses(day_id);
CREATE INDEX idx_expenses_category ON expenses(category);

COMMENT ON TABLE expenses IS 'Stores expense records for the trip';
