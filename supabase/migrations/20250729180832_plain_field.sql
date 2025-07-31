/*
  # Fix RLS policies for inventory_items to allow anonymous access

  This migration updates the Row Level Security policies for the inventory_items table
  to allow anonymous users to perform CRUD operations. This is necessary because the
  application is using the anonymous Supabase key for database operations.

  ## Changes
  1. Drop existing restrictive policies
  2. Create new policies that allow anonymous (public) role access
  3. Maintain RLS enabled for security structure
*/

-- Drop existing policies that may be blocking anonymous access
DROP POLICY IF EXISTS "Allow authenticated users to read inventory items" ON inventory_items;
DROP POLICY IF EXISTS "Allow authenticated users to insert inventory items" ON inventory_items;
DROP POLICY IF EXISTS "Allow authenticated users to update inventory items" ON inventory_items;
DROP POLICY IF EXISTS "Allow authenticated users to delete inventory items" ON inventory_items;

-- Create new policies that allow anonymous (public) role access
CREATE POLICY "Allow public read access to inventory items"
  ON inventory_items
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to inventory items"
  ON inventory_items
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to inventory items"
  ON inventory_items
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to inventory items"
  ON inventory_items
  FOR DELETE
  TO public
  USING (true);