-- Delete existing data
DELETE FROM "courts";

-- Reset sequence
ALTER SEQUENCE courts_id_seq RESTART WITH 1;

-- Insert new courts
INSERT INTO "courts" (name, type, price_per_hour, club_id, description, city, rating) VALUES
-- Amsterdam
('Padel Amsterdam Center Court', 'indoor', 45, 1, 'Premium indoor court with professional lighting and climate control. Perfect for year-round play.', 'Amsterdam', 4.8),
('Olympic Padel Arena', 'outdoor', 35, 1, 'Olympic-standard outdoor court with high-quality artificial turf and professional lighting.', 'Amsterdam', 4.7),
('Amstel Padel Club', 'indoor', 42, 1, 'Modern indoor facility with state-of-the-art courts and excellent amenities.', 'Amsterdam', 4.9),
('Zuid Padel Complex', 'outdoor', 32, 1, 'Beautiful outdoor courts in Amsterdam Zuid with great atmosphere.', 'Amsterdam', 4.6),

-- Rotterdam
('Rotterdam Padel Center', 'indoor', 40, 2, 'Centrally located indoor courts with professional coaching available.', 'Rotterdam', 4.7),
('Kralingen Padel Club', 'outdoor', 30, 2, 'Scenic outdoor courts in the heart of Kralingen.', 'Rotterdam', 4.5),
('Harbor Padel Rotterdam', 'indoor', 38, 2, 'Modern facility near the harbor with panoramic views.', 'Rotterdam', 4.8),
('Rotterdam South Padel', 'outdoor', 28, 2, 'Community-focused courts with competitive rates.', 'Rotterdam', 4.4),

-- Amersfoort
('Amersfoort Tennis & Padel', 'indoor', 35, 3, 'Premier indoor facility with professional-grade courts.', 'Amersfoort', 4.9),
('Hoogland Padel Center', 'outdoor', 28, 3, 'Family-friendly outdoor courts with excellent facilities.', 'Amersfoort', 4.6),
('Vathorst Padel Club', 'indoor', 32, 3, 'Modern indoor courts in the new Vathorst district.', 'Amersfoort', 4.7),

-- Utrecht
('Utrecht Central Padel', 'indoor', 40, 4, 'High-end indoor facility near Utrecht Central Station.', 'Utrecht', 4.8),
('Leidsche Rijn Padel', 'outdoor', 30, 4, 'Modern outdoor courts in the growing Leidsche Rijn area.', 'Utrecht', 4.6),
('Science Park Padel', 'indoor', 38, 4, 'University-adjacent courts popular with students and staff.', 'Utrecht', 4.7),

-- Den Haag
('The Hague Beach Padel', 'outdoor', 35, 5, 'Beachside courts with amazing views and atmosphere.', 'Den Haag', 4.8),
('Scheveningen Padel Center', 'indoor', 42, 5, 'Premium indoor facility near the famous pier.', 'Den Haag', 4.9),
('Padel Palace Den Haag', 'indoor', 40, 5, 'Luxurious indoor courts with high-end amenities.', 'Den Haag', 4.7),

-- Eindhoven
('High Tech Padel Campus', 'indoor', 38, 6, 'Modern facility in the technology hub of the Netherlands.', 'Eindhoven', 4.8),
('Strijp Padel Club', 'outdoor', 30, 6, 'Creative district courts with urban atmosphere.', 'Eindhoven', 4.6),
('Eindhoven South Padel', 'indoor', 35, 6, 'Family-friendly facility with courts for all skill levels.', 'Eindhoven', 4.7),

-- Groningen
('Groningen University Padel', 'indoor', 32, 7, 'Modern university courts open to public.', 'Groningen', 4.6),
('Martini Padel Club', 'outdoor', 28, 7, 'Central outdoor courts with city views.', 'Groningen', 4.5),
('Euroborg Padel Center', 'indoor', 35, 7, 'Professional facility near the FC Groningen stadium.', 'Groningen', 4.7);

-- Add facilities for each court
INSERT INTO "court_facilities" (court_id, name) 
SELECT id, 'Changing Rooms' FROM "courts";

INSERT INTO "court_facilities" (court_id, name) 
SELECT id, 'Showers' FROM "courts";

INSERT INTO "court_facilities" (court_id, name) 
SELECT id, 'Equipment Rental' FROM "courts";

INSERT INTO "court_facilities" (court_id, name) 
SELECT id, 'Parking' FROM "courts";

-- Add specific facilities for indoor courts
INSERT INTO "court_facilities" (court_id, name)
SELECT id, 'Climate Control' FROM "courts" WHERE type = 'indoor';

INSERT INTO "court_facilities" (court_id, name)
SELECT id, 'Professional Lighting' FROM "courts" WHERE type = 'indoor';
