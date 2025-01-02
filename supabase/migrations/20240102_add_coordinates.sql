-- Add location coordinates to clubs table
ALTER TABLE clubs
ADD COLUMN location TEXT;

-- Update existing clubs with some example coordinates (Amsterdam, Rotterdam, Utrecht)
UPDATE clubs
SET location = 
  CASE 
    WHEN city ILIKE '%amsterdam%' THEN '52.3676,4.9041'
    WHEN city ILIKE '%rotterdam%' THEN '51.9225,4.4792'
    WHEN city ILIKE '%utrecht%' THEN '52.0907,5.1214'
    WHEN city ILIKE '%den haag%' THEN '52.0705,4.3007'
    WHEN city ILIKE '%eindhoven%' THEN '51.4416,5.4697'
    ELSE NULL
  END;
