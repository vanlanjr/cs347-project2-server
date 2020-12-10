DROP TABLE IF EXISTS recipecategories;
DROP TABLE IF EXISTS recipe;
DROP TABLE IF EXISTS category;

CREATE TABLE recipe (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name TEXT,
  description TEXT,
  ingredients TEXT,
  steps TEXT,
  categories VARCHAR(256),
  is_deleted INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE category (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  value VARCHAR(35)
);

CREATE TABLE recipecategories (
  recipe_id INT NOT NULL,
  category_id INT NOT NULL,
  FOREIGN KEY (recipe_id) REFERENCES recipe(id),
  FOREIGN KEY (category_id) REFERENCES category(id)
);
