--Challenge: LighthouseBnB INSERT

--INSERT INTO users
INSERT INTO users (id, name, email, password) 
VALUES (1, 'Armand Hilll', 'lera_hahn@dickens.org', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
(2, 'Stephanie Wolff', 'darius.homenick@tod.ca', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
(3, 'Stan Miller', 'mcdermott.maxie@schoen.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

--INSERT INTO properties
INSERT INTO properties (id, owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active) 
VALUES (1, 1, 'Speed lamp', 'Text', 'Text', 'Text', 50, 1, 1, 1, 'Text', 'Text', 'Text', 'Text', 'Text', true),
(2, 2, 'Blank corner', 'Text', 'Text', 'Text', 50, 1, 1, 1, 'Text', 'Text', 'Text', 'Text', 'Text', true),
(3, 3, 'Habit mix', 'Text', 'Text', 'Text', 50, 1, 1, 1, 'Text', 'Text', 'Text', 'Text', 'Text', true);

--INSERT INTO reservations
INSERT INTO reservations (id, start_date, end_date, property_id, guest_id) 
VALUES (1, '2018-09-11', '2018-09-26', 1, 1),
(2, '2018-09-11', '2018-09-26', 2, 2),
(3, '2018-09-11', '2018-09-26', 3, 3);

--INSERT INTO rates
INSERT INTO rates (id, start_date, end_date, cost_per_night, property_id) 
VALUES (1,'2018-09-11', '2018-09-26', 50, 1),
(2, '2018-09-11', '2018-09-26', 50, 2),
(3, '2018-09-11', '2018-09-26', 50, 3);

--INSERT INTO property_reviews
INSERT INTO property_reviews (id, guest_id, reservation_id, property_id, rating, message) 
VALUES (1, 1, 1, 1, 5, 'Text'),
(2, 2, 2, 2, 4, 'Text'),
(3, 3, 3, 3, 4, 'Text');