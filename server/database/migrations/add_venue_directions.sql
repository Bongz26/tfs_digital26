-- Adds a free-text "Directions" field to cases (how to get to the house/venue).
-- Required by the Consultation Form on full case submission.
ALTER TABLE cases ADD COLUMN IF NOT EXISTS venue_directions TEXT;
