-- First, remove existing facilities
DELETE FROM court_facilities;

-- Insert new facilities for each court with random selection
WITH facility_options AS (
  SELECT unnest(ARRAY[
    'Changing Rooms',    -- Kleedkamers: Inclusief douches en lockers
    'Parking',          -- Parkeergelegenheid: Gratis of betaald parkeren
    'Restaurant',       -- Horeca: Een restaurant, café, of bar
    'Equipment Rental', -- Verhuur: Mogelijkheid tot het huren van rackets en ballen
    'Padel Shop',       -- Padelshop: Een winkel voor het kopen van uitrusting
    'Bike Storage',     -- Fietsenstalling: Voor mensen die met de fiets komen
    'Wheelchair Access', -- Rolstoeltoegankelijk: Bereikbaarheid voor mensen met een beperking
    'Charging Points'   -- Oplaadpunten: Voor elektrische auto's of fietsen
  ]) AS facility_name
),
court_list AS (
  SELECT id FROM courts
)
INSERT INTO court_facilities (court_id, name)
SELECT 
  c.id,
  f.facility_name
FROM court_list c
CROSS JOIN facility_options f
WHERE random() < 0.7; -- 70% chance for each court to have each facility

-- Add comment with translations for future reference
COMMENT ON TABLE court_facilities IS 'Available facilities with translations:
- Changing Rooms (Kleedkamers): Includes showers and lockers
- Parking (Parkeergelegenheid): Free or paid parking available
- Restaurant (Horeca): Restaurant, café, or bar for drinks and snacks
- Equipment Rental (Verhuur): Rent rackets and balls
- Padel Shop (Padelshop): Shop for buying equipment
- Bike Storage (Fietsenstalling): For cyclists
- Wheelchair Access (Rolstoeltoegankelijk): Accessible for people with disabilities
- Charging Points (Oplaadpunten): For electric cars or bikes';
