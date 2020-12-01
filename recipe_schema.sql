DROP TABLE IF EXISTS recipe;

CREATE TABLE recipe (
  id SERIAL PRIMARY KEY,
  name TEXT,
  description TEXT,
  ingredients TEXT,
  steps TEXT,
  is_deleted INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
