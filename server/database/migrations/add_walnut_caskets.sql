-- Migration: Add Walnut color caskets for Pongee and Raised Half View across branches
-- This ensures Walnut is tracked natively in inventory and stock reporting.

DO $$
DECLARE
    loc text;
    locations text[] := ARRAY['Head Office', 'Bethlehem', 'Bethlehem Branch', 'Makeneng'];
BEGIN
    FOREACH loc IN ARRAY locations
    LOOP
        -- 1. Pongee Walnut
        IF NOT EXISTS (
            SELECT 1 FROM inventory 
            WHERE category = 'coffin' 
              AND (UPPER(name) = 'PONGEE WALNUT' OR (UPPER(name) LIKE '%PONGEE%' AND UPPER(COALESCE(color, '')) = 'WALNUT'))
              AND UPPER(location) = UPPER(loc)
        ) THEN
            INSERT INTO inventory (name, model, color, category, stock_quantity, low_stock_threshold, location, created_at, updated_at)
            VALUES ('Pongee Walnut', 'Pongee', 'Walnut', 'coffin', 0, 1, loc, NOW(), NOW());
        END IF;

        -- 2. Raised Half View Walnut
        IF NOT EXISTS (
            SELECT 1 FROM inventory 
            WHERE category = 'coffin' 
              AND (UPPER(name) = 'RAISED HALF VIEW WALNUT' OR (UPPER(name) LIKE '%RAISED%' AND UPPER(COALESCE(color, '')) = 'WALNUT'))
              AND UPPER(location) = UPPER(loc)
        ) THEN
            INSERT INTO inventory (name, model, color, category, stock_quantity, low_stock_threshold, location, created_at, updated_at)
            VALUES ('Raised Half View Walnut', 'Raised Half View', 'Walnut', 'coffin', 0, 1, loc, NOW(), NOW());
        END IF;
    END LOOP;
END $$;
