const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const { resolve } = require('path');

const app = express();
const port = 3010;

app.use(cors());
app.use(express.static('static'));

let db;
(async () => {
  db = await open({
    filename: './BD4_Assignment1/database.sqlite',
    driver: sqlite3.Database,
  });
})();

//1.
async function fetchAllRestaurants() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);
  return {
    restaurants: response,
  };
}
app.get('/restaurants', async (req, res) => {
  try {
    let results = await fetchAllRestaurants();
    if (results.restaurants.length === 0)
      return res.status(404).json({ message: 'No restaurants found' });
    res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
//2.
async function fetchRestaurantsById(id) {
  let query = 'SELECT * FROM restaurants WHERE id=?';
  let response = await db.get(query, [id]);
  return {
    restaurants: response,
  };
}
app.get('/restaurants/details', async (req, res) => {
  const id = parseInt(req.query.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid Restaurant Id' });
  }
  try {
    let results = await fetchRestaurantsById(id);
    if (results.restaurants.length === 0)
      return res
        .status(404)
        .json({ message: 'No restaurants found with this ' + id });
    res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
//3.
async function fetchRestaurantsByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let response = await db.all(query, [cuisine]);
  return {
    restaurants: response,
  };
}
app.get('/restaurants/cuisine', async (req, res) => {
  const cuisine = req.query.cuisine;
  try {
    let results = await fetchRestaurantsByCuisine(cuisine);
    if (results.restaurants.length === 0)
      return res
        .status(404)
        .json({ message: 'No restaurant found with this ' + cuisine });
    res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
//4.
async function filterRestaurant(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return {
    restaurants: response,
  };
}
app.get('/restaurants/filter', async (req, res) => {
  const isVeg = req.query.isVeg;
  const hasOutdoorSeating = req.query.hasOutdoorSeating;
  const isLuxury = req.query.isLuxury;
  try {
    let results = await filterRestaurant(isVeg, hasOutdoorSeating, isLuxury);
    if (results.restaurants.length === 0)
      return res
        .status(404)
        .json({ message: 'No restaurant found with this filter' });
    res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
//5.
async function sortRestaurants() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query, []);
  return {
    restaurants: response,
  };
}
app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let results = await sortRestaurants();
    if (results.restaurants.length === 0)
      return res.status(404).json({ message: 'No restaurants found' });
    res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
//6.
async function fetchAllDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);
  return {
    dishes: response,
  };
}
app.get('/dishes', async (req, res) => {
  try {
    let results = await fetchAllDishes();
    if (results.dishes.length === 0)
      return res.status(404).json({ message: 'No dishes found' });
    res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
//7.
async function fetchAllDishes(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let response = await db.get(query, [id]);
  return {
    dish: response,
  };
}
app.get('/dishes/details', async (req, res) => {
  const id = req.query.id;
  try {
    let results = await fetchAllDishes(id);
    if (results.dish.length === 0)
      return res
        .status(404)
        .json({ message: 'No dishes found with this' + id });
    res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
//8.

async function fetchAllByIsVeg(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg = ?';
  let response = await db.all(query, [isVeg]);
  return {
    dishes: response,
  };
}
app.get('/dishes/filter', async (req, res) => {
  const isVeg = req.query.isVeg;
  try {
    let results = await fetchAllByIsVeg(isVeg);
    if (results.dishes.length === 0)
      return res.status(404).json({ message: 'No dishes found' });
    res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
//9.

async function sortByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price';
  let response = await db.all(query, []);
  return {
    dishes: response,
  };
}
app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let results = await sortByPrice();
    if (results.dishes.length === 0)
      return res.status(404).json({ message: 'No dishes found' });
    res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
