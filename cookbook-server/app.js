const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

let credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
let connection = mysql.createConnection(credentials);
connection.connect();

function rowToObject(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    ingredients: row.ingredients,
    steps: row.steps,
    categories: row.categories
  };
}

function rowToObjectCategory(row) {
  return {
    value: row.value
  };
}

// Get the table of contents -- all names
app.get('/recipes', (request, response) => {
  const query = 'SELECT id, name, description, ingredients, steps FROM recipe WHERE is_deleted = 0 ORDER BY id';
  const params = [];
  connection.query(query, params, (error, rows) => {
    response.send({
      ok: true,
      recipes: rows,
    });
  });
});

// Get a single recipe where the id matches
app.get('/recipe/:name', (request, response) => {
  const params = [request.params.name];
  const query = 'SELECT id, name, description, ingredients, steps FROM recipe WHERE is_deleted = 0 AND recipe.name = ? ';
  connection.query(query, params, (error, rows) => {
    response.send({
      ok: true,
      recipe: rows.map(rowToObject),
    });
  });
});

// Get the next recipe
app.get('/recipe/next/:id', (request, response) => {
  const params = [request.params.id];
  const query = 'select id from recipe where id = (select min(id) from recipe where id > ?)';
  connection.query(query, params, (error, rows) => {
    response.send({
      ok: true,
      recipe: rows,
    });
  });
});

// Get the previous recipe
app.get('/recipe/prev/:id', (request, response) => {
  const params = [request.params.id];
  const query = 'select * from recipe where id = (select max(id) from recipe where id < ?)';
  connection.query(query, params, (error, rows) => {
    response.send({
      ok: true,
      recipe: rows.map(rowToObject),
    });
  });
});

// Insert new recipe into database
app.post('/recipe', (request, response) => {
  const query = 'INSERT INTO recipe(name, description, ingredients, steps) VALUES (?, ?, ?, ?); ';
  const params = [request.body.name, request.body.description, request.body.ingredients, request.body.steps];
  connection.query(query, params, (error, result) => {
    if (error) {
      console.log(error);
    } else {
    response.send({
      ok: true,
      id: result.insertId,
    });
    }
  });
});


// Update a recipe in the database
app.patch('/recipe/:id', (request, response) => {
  const query = 'UPDATE recipe SET name = ?, description = ?, ingredients = ?, steps = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  const params = [request.body.name, request.body.description, request.body.ingredients, request.body.steps, request.params.id];
  connection.query(query, params, (error, result) => {
    response.send({
      ok: true,
    });
  });
});

// Delete a recipe from the database
app.delete('/recipe/:id', (request, response) => {
  const query = 'UPDATE recipe SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  const params = [request.params.id];
  connection.query(query, params, (error, result) => {
    response.send({
      ok: true,
    });
  });
});

const port = 3443;
app.listen(port, () => {
	console.log('We are live on port 3443');
});

