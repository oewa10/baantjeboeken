-- Enable Row Level Security
ALTER TABLE courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE court_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access to courts and related data
CREATE POLICY "Allow public read access to courts"
ON courts FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public read access to clubs"
ON clubs FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public read access to court facilities"
ON court_facilities FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public read access to availability"
ON availability FOR SELECT
TO public
USING (true);

-- Bookings should only be readable by the user who made them
CREATE POLICY "Users can read their own bookings"
ON bookings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT SELECT ON courts TO anon, authenticated;
GRANT SELECT ON clubs TO anon, authenticated;
GRANT SELECT ON court_facilities TO anon, authenticated;
GRANT SELECT ON availability TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON bookings TO authenticated;
