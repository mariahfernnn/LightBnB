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

// Use node-postgres to have the getAllReservations query the lightbnb database
// This function accepts a guest_id, limits the properties to 10 and returns a promise
const getAllReservations = function(guest_id, limit = 10) {
  const queryString = `
  SELECT p.*, r.*, avg(property_reviews.rating) AS average_rating
  FROM reservations r
  JOIN properties p
  ON r.property_id = p.id
  JOIN property_reviews ON p.id = property_reviews.property_id 
  WHERE r.guest_id = $1
  AND r.end_date < now()::date
  GROUP BY p.title, p.id, r.start_date, r.id
  ORDER BY r.start_date 
  LIMIT $2;
  `;
  // Store values in an array
  const values = [guest_id, limit];

  return pool.query(queryString, values)
  .then(res => res.rows)
  .catch(err => console.error(err));
  // return getAllProperties(null, 2);
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
 // Assisted by Peter Hang - ternary operators
 // Assisted by Miguel Cruz - convert cents to dollars
const getAllProperties = function(options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties 
  LEFT JOIN property_reviews ON properties.id = property_id
  `;

  let check = false;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length}`;
    check = true;
  }
  if(options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `${check ? ' AND ' : ' WHERE '} owner_id = $${queryParams.length}`;
    check = true;
  }
  if(options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night * 1000}`);
    queryString += `${check ? ' AND ' : ' WHERE '} cost_per_night <= $${queryParams.length}`;
    check = true;
  }
  if(options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night * 1000}`);
    queryString += `${check ? ' AND ' : ' WHERE '} cost_per_night >= $${queryParams.length}`;
    check = true;
  }
  if(options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `${check ? ' AND ' : ' WHERE '} rating >= $${queryParams.length}`;
    check = true;
  }

  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams)
  .then(res => res.rows);

  // return pool.query(`
  // SELECT * 
  // FROM properties
  // LIMIT $1
  // `, [limit])
  // .then(res => res.rows);
}
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */

 //
 // Assisted by Andrew Matte - make sure parameters you are passing in the INSERT TO statements are exactly the same as the values
 // Assisted by Will Hawkins - make sure you are adding new listings into the database - added owner_id
const addProperty = function(property) {
  const queryString = `
  INSERT INTO properties (
    owner_id,
    title,
    description, 
    cover_photo_url, 
    thumbnail_photo_url, 
    cost_per_night, 
    parking_spaces, 
    number_of_bathrooms, 
    number_of_bedrooms, 
    province, 
    city, 
    country, 
    street, 
    post_code) 
    VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
  `;

  const values = [property.owner_id, property.title, 
    property.description, 
    property.cover_photo_url, 
    property.thumbnail_photo_url, 
    property.cost_per_night,
    property.parking_spaces, 
    property.number_of_bathrooms, 
    property.number_of_bedrooms, 
    property.province, 
    property.city, 
    property.country,
    property.street, 
    property.post_code, 
    ];

    return pool.query(queryString, values)
  .then(property => property.rows[0])
  .catch(err => console.error(err));

  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);
}
exports.addProperty = addProperty;
