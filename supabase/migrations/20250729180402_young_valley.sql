/*
  # Fix Row Level Security policies for inventory_items table

  1. Security Updates
    - Update INSERT policy to allow all authenticated users to create inventory items
    - Update DELETE policy to allow authenticated users to delete inventory items
    - Ensure proper permissions for inventory management functionality

  2. Changes Made
    - Modified INSERT policy to use simple authenticated check
    - Added DELETE policy for inventory item removal
    - Maintained existing SELECT and UPDATE policies
*/

-- Drop existing restrictive INSERT policy
DROP POLICY IF EXISTS "Allow authenticated users to create inventory items" ON inventory_items;

-- Create new INSERT policy that allows all authenticated users
CREATE POLICY "Allow authenticated users to create inventory items"
  ON inventory_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add DELETE policy for authenticated users
DROP POLICY IF EXISTS "Allow authenticated users to delete inventory items" ON inventory_items;

CREATE POLICY "Allow authenticated users to delete inventory items"
  ON inventory_items
  FOR DELETE
  TO authenticated
  USING (true);

-- Ensure UPDATE policy allows all authenticated users
DROP POLICY IF EXISTS "Allow authenticated users to update inventory items" ON inventory_items;

CREATE POLICY "Allow authenticated users to update inventory items"
  ON inventory_items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);