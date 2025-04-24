CREATE TABLE IF NOT EXISTS players (
    name VARCHAR(255) NOT NULL,
    position VARCHAR(100) NOT NULL,
    team VARCHAR(100) NOT NULL,
    draftyear INT NOT NULL,
    PRIMARY KEY (name, position, team)
);


CREATE TABLE IF NOT EXISTS drafts (
    id IDENTITY PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(50) DEFAULT 'offline'  -- 'offline' or 'online'
);

CREATE TABLE IF NOT EXISTS draft_picks (
    draft_id BIGINT NOT NULL,
    pick_number INT NOT NULL,  -- 1-based (e.g., 1, 2, 3, etc.)
    name VARCHAR(255) NOT NULL,
    position VARCHAR(100) NOT NULL,
    team VARCHAR(100) NOT NULL,
    PRIMARY KEY (draft_id, pick_number),
    FOREIGN KEY (draft_id) REFERENCES drafts(id) ON DELETE CASCADE,
    FOREIGN KEY (name, position, team) REFERENCES players(name, position, team)
);