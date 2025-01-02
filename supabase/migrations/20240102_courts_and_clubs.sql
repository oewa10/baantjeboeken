-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- First disable RLS
ALTER TABLE courts DISABLE ROW LEVEL SECURITY;
ALTER TABLE court_facilities DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE clubs DISABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Clear existing data
TRUNCATE TABLE courts CASCADE;
TRUNCATE TABLE clubs CASCADE;
TRUNCATE TABLE court_facilities CASCADE;
TRUNCATE TABLE bookings CASCADE;

-- Insert clubs
WITH inserted_clubs AS (
    INSERT INTO clubs (name, city, created_at, updated_at) VALUES
    ('Amsterdam Padel Center', 'Amsterdam', NOW(), NOW()),
    ('Rotterdam Sports Complex', 'Rotterdam', NOW(), NOW()),
    ('Amersfoort Tennis & Padel', 'Amersfoort', NOW(), NOW()),
    ('Utrecht Padel Academy', 'Utrecht', NOW(), NOW()),
    ('The Hague Sports Club', 'Den Haag', NOW(), NOW()),
    ('Eindhoven Padel Hub', 'Eindhoven', NOW(), NOW()),
    ('Groningen University Sports', 'Groningen', NOW(), NOW())
    RETURNING id, name
),
-- Insert courts
inserted_courts AS (
    INSERT INTO courts (name, type, price_per_hour, club_id, description, city, rating, created_at, updated_at)
    SELECT
        c.court_name,
        c.type,
        c.price_per_hour,
        ic.id as club_id,
        c.description,
        c.city,
        c.rating,
        NOW(),
        NOW()
    FROM (
        VALUES
            ('Padel Amsterdam Center Court', 'indoor', 45.00, 'Amsterdam Padel Center', 'Premium indoor court with professional lighting and climate control. Perfect for year-round play.', 'Amsterdam', 4.8),
            ('Olympic Padel Arena', 'outdoor', 35.00, 'Amsterdam Padel Center', 'Olympic-standard outdoor court with high-quality artificial turf and professional lighting.', 'Amsterdam', 4.7),
            ('Amstel Padel Club', 'indoor', 42.00, 'Amsterdam Padel Center', 'Modern indoor facility with state-of-the-art courts and excellent amenities.', 'Amsterdam', 4.9),
            ('Zuid Padel Complex', 'outdoor', 32.00, 'Amsterdam Padel Center', 'Beautiful outdoor courts in Amsterdam Zuid with great atmosphere.', 'Amsterdam', 4.6),
            
            ('Rotterdam Padel Center', 'indoor', 40.00, 'Rotterdam Sports Complex', 'Centrally located indoor courts with professional coaching available.', 'Rotterdam', 4.7),
            ('Kralingen Padel Club', 'outdoor', 30.00, 'Rotterdam Sports Complex', 'Scenic outdoor courts in the heart of Kralingen.', 'Rotterdam', 4.5),
            ('Harbor Padel Rotterdam', 'indoor', 38.00, 'Rotterdam Sports Complex', 'Modern facility near the harbor with panoramic views.', 'Rotterdam', 4.8),
            ('Rotterdam South Padel', 'outdoor', 28.00, 'Rotterdam Sports Complex', 'Community-focused courts with competitive rates.', 'Rotterdam', 4.4),
            
            ('Amersfoort Tennis & Padel', 'indoor', 35.00, 'Amersfoort Tennis & Padel', 'Premier indoor facility with professional-grade courts.', 'Amersfoort', 4.9),
            ('Hoogland Padel Center', 'outdoor', 28.00, 'Amersfoort Tennis & Padel', 'Family-friendly outdoor courts with excellent facilities.', 'Amersfoort', 4.6),
            ('Vathorst Padel Club', 'indoor', 32.00, 'Amersfoort Tennis & Padel', 'Modern indoor courts in the new Vathorst district.', 'Amersfoort', 4.7),
            
            ('Utrecht Central Padel', 'indoor', 40.00, 'Utrecht Padel Academy', 'High-end indoor facility near Utrecht Central Station.', 'Utrecht', 4.8),
            ('Leidsche Rijn Padel', 'outdoor', 30.00, 'Utrecht Padel Academy', 'Modern outdoor courts in the growing Leidsche Rijn area.', 'Utrecht', 4.6),
            ('Science Park Padel', 'indoor', 38.00, 'Utrecht Padel Academy', 'University-adjacent courts popular with students and staff.', 'Utrecht', 4.7),
            
            ('The Hague Beach Padel', 'outdoor', 35.00, 'The Hague Sports Club', 'Beachside courts with amazing views and atmosphere.', 'Den Haag', 4.8),
            ('Scheveningen Padel Center', 'indoor', 42.00, 'The Hague Sports Club', 'Premium indoor facility near the famous pier.', 'Den Haag', 4.9),
            ('Padel Palace Den Haag', 'indoor', 40.00, 'The Hague Sports Club', 'Luxurious indoor courts with high-end amenities.', 'Den Haag', 4.7),
            
            ('High Tech Padel Campus', 'indoor', 38.00, 'Eindhoven Padel Hub', 'Modern facility in the technology hub of the Netherlands.', 'Eindhoven', 4.8),
            ('Strijp Padel Club', 'outdoor', 30.00, 'Eindhoven Padel Hub', 'Creative district courts with urban atmosphere.', 'Eindhoven', 4.6),
            ('Eindhoven South Padel', 'indoor', 35.00, 'Eindhoven Padel Hub', 'Family-friendly facility with courts for all skill levels.', 'Eindhoven', 4.7),
            
            ('Groningen University Padel', 'indoor', 32.00, 'Groningen University Sports', 'Modern university courts open to public.', 'Groningen', 4.6),
            ('Martini Padel Club', 'outdoor', 28.00, 'Groningen University Sports', 'Central outdoor courts with city views.', 'Groningen', 4.5),
            ('Euroborg Padel Center', 'indoor', 35.00, 'Groningen University Sports', 'Professional facility near the FC Groningen stadium.', 'Groningen', 4.7)
        ) as c(court_name, type, price_per_hour, club_name, description, city, rating)
    JOIN inserted_clubs ic ON ic.name = c.club_name
    RETURNING id
)
-- Add facilities for each court
INSERT INTO court_facilities (court_id, name)
SELECT id, facility
FROM inserted_courts
CROSS JOIN (
    VALUES
        ('Changing Rooms'),
        ('Showers'),
        ('Equipment Rental'),
        ('Parking')
) as f(facility)
UNION ALL
SELECT c.id, facility
FROM inserted_courts c
JOIN courts co ON c.id = co.id
CROSS JOIN (
    VALUES
        ('Climate Control'),
        ('Professional Lighting')
) as f(facility)
WHERE co.type = 'indoor';

-- Enable RLS
ALTER TABLE courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE court_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON courts;
DROP POLICY IF EXISTS "Enable read access for all users" ON court_facilities;
DROP POLICY IF EXISTS "Enable read access for all users" ON clubs;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON bookings;
DROP POLICY IF EXISTS "Enable read for users own bookings" ON bookings;

-- Create new policies
CREATE POLICY "Enable read access for all users" ON courts
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Enable read access for all users" ON court_facilities
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Enable read access for all users" ON clubs
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON bookings
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable read for users own bookings" ON bookings
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
