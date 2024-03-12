-- Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

insert into users (username, password, email) values ('admin', '123', 'admin@admin');

-- Farms Table
CREATE TABLE farms (
    farm_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    name VARCHAR(255) NOT NULL,
    level INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Buildings Table
CREATE TABLE buildings (
    building_id SERIAL PRIMARY KEY,
    farm_id INT REFERENCES farms(farm_id),
    building_type VARCHAR(255) NOT NULL,
    level INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crops Table
CREATE TABLE crops (
    crop_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    growth_time INT NOT NULL, -- Time in hours
    sell_price INT NOT NULL
);

-- Planted Crops Table to track crops planted on a farm
CREATE TABLE planted_crops (
    planted_crop_id SERIAL PRIMARY KEY,
    crop_id INT REFERENCES crops(crop_id),
    farm_id INT REFERENCES farms(farm_id),
    harvest_time TIMESTAMP NOT NULL
);

-- Market Table for dynamic pricing (Optional, depends on game mechanics)
CREATE TABLE market (
    market_id SERIAL PRIMARY KEY,
    crop_id INT REFERENCES crops(crop_id),
    current_price INT NOT NULL,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resources Table to track user resources like money, crops, etc.
CREATE TABLE resources (
    resource_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    type VARCHAR(255) NOT NULL,
    quantity INT DEFAULT 0
);

-- Attacks Table (If implementing the attack feature)
CREATE TABLE attacks (
    attack_id SERIAL PRIMARY KEY,
    attacker_farm_id INT REFERENCES farms(farm_id),
    defender_farm_id INT REFERENCES farms(farm_id),
    result VARCHAR(255), -- Win or Lose
    loot INT, -- Amount of resources stolen
    attack_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Friendships Table to track friendships between users
CREATE TABLE friendships (
    friendship_id SERIAL PRIMARY KEY,
    user_id_1 INT REFERENCES users(user_id),
    user_id_2 INT REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat Messages Table
CREATE TABLE chat_messages (
    message_id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(user_id),
    receiver_id INT REFERENCES users(user_id),
    message_text TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE game_maps (
    map_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    width INT NOT NULL,
    height INT NOT NULL,
    -- terrain_data TEXT, -- This could be JSON or another format to describe terrain types across the map
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO game_maps (user_id, width, height) VALUES (1, 50, 50);

CREATE TABLE map_tiles (
    tile_id SERIAL PRIMARY KEY,
    map_id INT REFERENCES game_maps(map_id),
    x INT NOT NULL,
    y INT NOT NULL,
    terrain_type VARCHAR(255) NOT NULL, -- e.g., Grassland, Forest, Water
    occupant_id INT, -- Optional, to link to whatever occupies the tile (a building, resource, etc.)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO map_tiles (map_id, x, y, terrain_type) VALUES (1, 0, 0, 'Grass');