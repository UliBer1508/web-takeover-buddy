-- Add external_house_id column to map to external booking database
ALTER TABLE houses ADD COLUMN external_house_id uuid;