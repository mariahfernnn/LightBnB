const properties = require('./json/properties.json');
const users = require('./json/users.json');

// Install pg
const { Pool } = require('pg');

// Connect to the lightbnb database 
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

// Use node-postgres to have the getUserWithEmail query the lightbnb database
// Accepts an email address and return a promise 
// Should resolve with the user that has that email address or null if that user does not exist
// Assisted by Miguel Cruz
const getUserWithEmail = function(email) {
  return pool.query(`
  SELECT *
  FROM users
  WHERE email = $1`, [email])
  .then(user => user.rows[0])
  .catch(err => console.error(err));
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

// Use node-postgres to have the getUserWithId query the lightbnb database
// Will do the same as getUserWithEmail but using the user's id instead of email
const getUserWithId = function(id) {
  return pool.query(`
  SELECT *
  FROM users
  WHERE id = $1`, [id])
  .then(user => user.rows[0])
  .catch(err => console.error(err));
}
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

// Use node-postgres to have the addUser query the lightbnb database
// Accepts a user object that will have a name, email, and hashed password property
// This function should insert the new user into the database
// It will return a promise that resolves with the new user object - should contain the user's id after its been added to the database
const addUser =  function(user) {
  const queryString = `
  INSERT INTO users (
    name, email, password) 
    VALUES (
    $1, $2, $3)
    RETURNING *;
  `;
  // Store values in an array
  const values = [user.name, user.email, user.password];

  return pool.query(queryString, values)
  .then(user => user.rows[0])
  .catch(err => console.error(err));
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

 // Use node-postgres to have the getAllProperties query the lightbnb database
 // Return res.rows as the result of a promise
const getAllProperties = function(options, limit = 10) {
  return pool.query(`
  SELECT * 
  FROM properties
  LIMIT $1
  `, [limit])
  .then(res => res.rows);
}
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
