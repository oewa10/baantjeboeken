-- First, drop the duplicate tables and their dependencies
DROP TABLE IF EXISTS "Court" CASCADE;
DROP TABLE IF EXISTS "Club" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "_prisma_migrations" CASCADE;
DROP TABLE IF EXISTS "Availability" CASCADE;

-- Now recreate our schema with clean tables
DROP TABLE IF EXISTS courts CASCADE;
DROP TABLE IF EXISTS clubs CASCADE;
DROP TABLE IF EXISTS facilities CASCADE;
DROP TABLE IF EXISTS availability CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS court_facilities CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create clean tables
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE clubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE courts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('indoor', 'outdoor')),
    price_per_hour NUMERIC NOT NULL,
    club_id UUID REFERENCES clubs(id) NOT NULL,
    description TEXT,
    city TEXT NOT NULL,
    rating NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    court_id UUID REFERENCES courts(id) NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    court_id UUID REFERENCES courts(id) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('available', 'booked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    court_id UUID REFERENCES courts(id) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('confirmed', 'cancelled', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert sample data
INSERT INTO users (email, name) VALUES
    ('john.doe@example.com', 'John Doe'),
    ('jane.smith@example.com', 'Jane Smith'),
    ('mike.wilson@example.com', 'Mike Wilson');

INSERT INTO clubs (name, city, location) VALUES
    ('Amsterdam Padel Center', 'Amsterdam', 'Rhôneweg 40, 1043 AH Amsterdam'),
    ('Rotterdam Sports Complex', 'Rotterdam', 'Maashaven Oostzijde 151, 3072 HS Rotterdam'),
    ('Amersfoort Tennis & Padel', 'Amersfoort', 'Barchman Wuytierslaan 93, 3819 AB Amersfoort'),
    ('Utrecht Padel Academy', 'Utrecht', 'Manitobadreef 8, 3565 CH Utrecht'),
    ('The Hague Sports Club', 'Den Haag', 'Laan van Poot 38C, 2566 EC Den Haag'),
    ('Eindhoven Padel Hub', 'Eindhoven', 'Antoon Coolenlaan 1, 5644 RX Eindhoven'),
    ('Groningen University Sports', 'Groningen', 'Blauwborgje 16, 9747 AC Groningen');

-- Insert courts for each club
WITH club_data AS (
    SELECT id, name, city
    FROM clubs
)
INSERT INTO courts (name, type, price_per_hour, club_id, description, city, rating)
SELECT 
    cd.name || ' - Court ' || court_number,
    CASE WHEN court_number % 2 = 0 THEN 'indoor' ELSE 'outdoor' END,
    CASE 
        WHEN cd.name LIKE '%Amsterdam%' THEN 45
        WHEN cd.name LIKE '%Rotterdam%' THEN 40
        ELSE 35
    END,
    cd.id,
    CASE 
        WHEN court_number % 2 = 0 
        THEN 'Premium indoor court with professional lighting and climate control. Perfect for year-round play.'
        ELSE 'Olympic-standard outdoor court with high-quality artificial turf and professional lighting.'
    END,
    cd.city,
    4 + random()
FROM club_data cd
CROSS JOIN generate_series(1, 2) AS court_number;

-- Insert facilities for each court
INSERT INTO facilities (court_id, name)
SELECT 
    c.id,
    f.facility_name
FROM courts c
CROSS JOIN (
    VALUES 
        ('Changing Rooms'),
        ('Showers'),
        ('Equipment Rental')
) AS f(facility_name);

-- Insert availability data for the next 7 days
INSERT INTO availability (court_id, start_time, end_time, status)
SELECT 
    c.id,
    date_trunc('hour', NOW() + (interval '1 day' * d)) + (interval '1 hour' * h),
    date_trunc('hour', NOW() + (interval '1 day' * d)) + (interval '1 hour' * (h + 1)),
    CASE WHEN random() < 0.7 THEN 'available' ELSE 'booked' END
FROM courts c
CROSS JOIN generate_series(0, 7) AS d
CROSS JOIN generate_series(9, 22) AS h;

-- Insert some sample bookings
WITH sample_booking AS (
    SELECT 
        c.id as court_id,
        u.id as user_id,
        date_trunc('hour', NOW() + (interval '1 day' * d)) + (interval '1 hour' * h) as start_time,
        date_trunc('hour', NOW() + (interval '1 day' * d)) + (interval '1 hour' * (h + 1)) as end_time
    FROM courts c
    CROSS JOIN users u
    CROSS JOIN generate_series(1, 3) as d
    CROSS JOIN generate_series(10, 12) as h
    LIMIT 10
)
INSERT INTO bookings (court_id, user_id, start_time, end_time, status)
SELECT 
    court_id,
    user_id,
    start_time,
    end_time,
    'confirmed'
FROM sample_booking;
