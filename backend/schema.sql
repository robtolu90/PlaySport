-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS match_participants;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS venues;
DROP TABLE IF EXISTS users;

-- 1. Create Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255)
);

-- 2. Create User Roles table (ElementCollection)
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 3. Create Venues table
CREATE TABLE venues (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    sport_type VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(255),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    max_players INTEGER,
    hourly_rate DOUBLE PRECISION,
    description VARCHAR(255)
);

-- 4. Create Matches table
CREATE TABLE matches (
    id BIGSERIAL PRIMARY KEY,
    sport_type VARCHAR(255) NOT NULL,
    venue_id BIGINT,
    organizer_id BIGINT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    max_players INTEGER,
    price_per_player DOUBLE PRECISION,
    description VARCHAR(255),
    FOREIGN KEY (venue_id) REFERENCES venues(id),
    FOREIGN KEY (organizer_id) REFERENCES users(id)
);

-- 5. Create Match Participants table (ManyToMany)
CREATE TABLE match_participants (
    match_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    PRIMARY KEY (match_id, user_id),
    FOREIGN KEY (match_id) REFERENCES matches(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 6. Create Bookings table
CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    venue_id BIGINT,
    user_id BIGINT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(255),
    FOREIGN KEY (venue_id) REFERENCES venues(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
