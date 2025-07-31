/*
  # Fix RLS policies for inventory_items table

  1. Policy Updates
    - Drop existing restrictive INSERT policy that references non-existent created_by column
    - Create new INSERT policy allowing authenticated users to create inventory items
    - Update existing policies to use proper conditions
    - Ensure all CRUD operations work for authenticated users

  2. Security
    - Maintain RLS protection while allowing necessary operations
    - Require authentication for all operations
    - Remove references to non-existent columns
*/

-- Drop existing policies that may be causing issues
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON inventory_items;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON inventory_items;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON inventory_items;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON inventory_items;

-- Create new policies that work with the actual table structure
CREATE POLICY "Allow authenticated users to insert inventory items"
  ON inventory_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read inventory items"
  ON inventory_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update inventory items"
  ON inventory_items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete inventory items"
  ON inventory_items
  FOR DELETE
  TO authenticated
  USING (true);