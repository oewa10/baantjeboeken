-- Add bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    court_id UUID REFERENCES courts(id) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('confirmed', 'cancelled', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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
