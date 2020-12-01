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
    name: row.name,
    description: row.description,
    ingredients: row.ingredients,
    steps: row.steps,
  };
}

app.get('/recipes', (request, response) => {
  const query = 'SELECT name, description, ingredients, steps FROM recipe WHERE is_deleted = 0 ORDER BY name; ';
  const params = [];
  connection.query(query, params, (error, rows) => {
    response.send({
      ok: true,
      recipes: rows.map(rowToObject),
    });
  });
});

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

app.patch('/recipe/:id', (request, response) => {
  const query = 'UPDATE recipe SET name = ?, description = ?, ingredients = ?, steps = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  const params = [request.body.name, request.body.description, request.body.ingredients, request.body.steps, request.params.id];
  connection.query(query, params, (error, result) => {
    response.send({
      ok: true,
    });
  });
});

app.delete('/recipe/:id', (request, response) => {
  const query = 'UPDATE recipe SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  const params = [request.params.id];
  connection.query(query, params, (error, result) => {
    response.send({
      ok: true,
    });
  });
});

//
// Below are functions for my app.
//

// Get table of contents for cookbook
app.get('/contents', (request, response) => {
  const query = 'SELECT name FROM recipe WHERE is_deleted = 0 ORDER BY id';
  const params = [];
  connection.query(query, params, (error, rows) => {
    response.send({
      ok: true,
      recipes: rows.map(rowToObject),
    });
  });
});

// Get single recipe page for cookbook
app.get('/getrecipe/:id', (request, response) => {
  const query = 'SELECT name, description, ingredients, steps FROM recipe WHERE id = ?'';
  const params = [];
  connection.query(query, params, (error, rows) => {
    response.send({
      ok: true,
      recipes: rows.map(rowToObject),
    });
  });
});

const port = 3443;
app.listen(port, () => {
	console.log('We are live');
});
