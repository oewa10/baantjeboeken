-- Delete existing data
DELETE FROM "clubs";

-- Reset sequence
ALTER SEQUENCE clubs_id_seq RESTART WITH 1;

-- Insert clubs
INSERT INTO "clubs" (name, address, city) VALUES
('Amsterdam Padel Center', 'Olympiaplein 31', 'Amsterdam'),
('Rotterdam Sports Complex', 'Sportlaan 12', 'Rotterdam'),
('Amersfoort Tennis & Padel', 'Sportpark Bokkeduinen 4', 'Amersfoort'),
('Utrecht Padel Academy', 'Tennispad 5', 'Utrecht'),
('The Hague Sports Club', 'Strandweg 4', 'Den Haag'),
('Eindhoven Padel Hub', 'High Tech Campus 1', 'Eindhoven'),
('Groningen University Sports', 'Blauwborgje 16', 'Groningen');
