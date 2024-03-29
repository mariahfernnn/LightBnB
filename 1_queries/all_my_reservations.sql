--All My Reservations
SELECT properties.id AS id, properties.title AS title, properties.cost_per_night AS cost_per_night, reservations.start_date AS start_date, avg(property_reviews.rating) AS average_rating
FROM reservations
JOIN properties ON reservations.property_id = properties.id
JOIN property_reviews ON properties.id = property_reviews.property_id 
WHERE reservations.guest_id = 1
AND reservations.end_date < now()::date
GROUP BY properties.title, properties.id, reservations.start_date
ORDER BY reservations.start_date 
LIMIT 10;