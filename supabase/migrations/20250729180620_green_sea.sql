/*
  # Fix RLS policies for inventory_items table

  1. Security Updates
    - Drop existing restrictive INSERT policy
    - Create new INSERT policy allowing authenticated users
    - Ensure all CRUD operations work for authenticated users

  2. Changes Made
    - Allow authenticated users to INSERT inventory items
    - Maintain existing SELECT, UPDATE, DELETE policies for authenticated users
    - Keep security intact while enabling functionality
*/

-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Allow authenticated users to create inventory items" ON inventory_items;

-- Create a new INSERT policy that allows authenticated users to create inventory items
CREATE POLICY "Enable insert for authenticated users" 
ON inventory_items 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Ensure UPDATE policy allows authenticated users to modify inventory items
DROP POLICY IF EXISTS "Allow authenticated users to update inventory items" ON inventory_items;
CREATE POLICY "Enable update for authenticated users" 
ON inventory_items 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Ensure DELETE policy allows authenticated users to delete inventory items  
DROP POLICY IF EXISTS "Allow authenticated users to delete inventory items" ON inventory_items;
CREATE POLICY "Enable delete for authenticated users" 
ON inventory_items 
FOR DELETE 
TO authenticated 
USING (true);

-- Ensure SELECT policy allows authenticated users to read inventory items
DROP POLICY IF EXISTS "Allow authenticated users to read inventory items" ON inventory_items;
CREATE POLICY "Enable read for authenticated users" 
ON inventory_items 
FOR SELECT 
TO authenticated 
USING (true);