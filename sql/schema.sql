-- Users Table
CREATE TABLE users (
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Farms Table
CREATE TABLE farms (
    farm_id SERIAL PRIMARY KEY,
    username_owner VARCHAR(255) REFERENCES users(username),
    name VARCHAR(255) NOT NULL,
    level INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Buildings Table
CREATE TABLE buildings (
    building_id VARCHAR(255),
    username_owner VARCHAR(255),
    building_type VARCHAR(255) NOT NULL,
    level INT DEFAULT 1,
    x INT NOT NULL,
    y INT NOT NULL,
    tile_rel_locations JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (username_owner, building_id),  -- Adding a primary key constraint
    CONSTRAINT unique_building_username_building_id UNIQUE (username_owner, building_id) -- Adding a unique constraint
);


-- Crops Table
CREATE TABLE crops (
    crop_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    growth_time INT NOT NULL, -- Time in hours
    sell_price INT NOT NULL  -- base sell price
);

-- Animal Table
CREATE TABLE animals (
    owner VARCHAR(255) REFERENCES users(username),
    species VARCHAR(255) NOT NULL,
    amount INT NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (owner,species)
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
    crop_name VARCHAR(255) NOT NULL PRIMARY KEY,
    current_price INT NOT NULL,
    current_quantity_crop INT,
    prev_quantity_crop INT,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_crop_name UNIQUE (crop_name)
);

-- Resources Table to track user resources like money, crops, etc.
CREATE TABLE resources (
    resource_id SERIAL PRIMARY KEY,
    owner VARCHAR(255) REFERENCES users(username),
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
    user_1 VARCHAR(255) REFERENCES users(username),
    user_2 VARCHAR(255) REFERENCES users(username),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat Messages Table
CREATE TABLE chat_messages (
    message_id SERIAL PRIMARY KEY,
    sender VARCHAR(255) REFERENCES users(username),
    receiver VARCHAR(255) REFERENCES users(username),
    message_text TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE game_maps (
    map_id SERIAL PRIMARY KEY,
    username_owner VARCHAR(255) REFERENCES users(username),
    width INT NOT NULL,
    height INT NOT NULL,
    -- terrain_data TEXT, -- This could be JSON or another format to describe terrain types across the map
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE map_tiles (
    tile_id SERIAL PRIMARY KEY,
    map_id INT REFERENCES game_maps(map_id),
    x INT NOT NULL,
    y INT NOT NULL,
    terrain_type VARCHAR(255) NOT NULL, -- e.g., Grassland, Forest, Water
    occupant_id INT, -- Optional, to link to whatever occupies the tile (a building, resource, etc.)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- explorations Table to track user ongoing explorations.
CREATE TABLE explorations (
    owner VARCHAR(255) PRIMARY KEY REFERENCES users(username),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration INT NOT NULL  , -- in minutes
    chickens INT,
    goats INT,
    pigs INT,
    cows INT,
    exploration_level INT,
    augment_level INT,
    surviving_goats INT,
    rewards_of_goats INT,
    surviving_chickens INT,
    surviving_pigs INT,
    surviving_cows INT,
    rewards_of_cows INT
    -- refetching the exploration from database can regenerate the rewards but the amount of surviving animals and crates should be constant
);