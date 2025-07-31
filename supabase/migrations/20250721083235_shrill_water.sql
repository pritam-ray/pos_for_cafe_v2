/*
  # Add inventory management features

  1. New Columns for inventory_items
    - category (text) - Item category
    - supplier (text) - Supplier information
    - cost_per_unit (numeric) - Cost per unit
    - location (text) - Storage location
    - expiry_date (date) - Expiry date
    - last_ordered_date (timestamptz) - Last order date
    - reorder_quantity (integer) - Quantity to reorder

  2. New Columns for inventory_transactions
    - previous_quantity (integer) - Quantity before transaction
    - new_quantity (integer) - Quantity after transaction
    - unit_cost (numeric) - Cost per unit for this transaction

  3. Security
    - Maintain existing RLS policies
*/

-- Add new columns to inventory_items if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'inventory_items' AND column_name = 'category'
  ) THEN
    ALTER TABLE public.inventory_items ADD COLUMN category text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'inventory_items' AND column_name = 'supplier'
  ) THEN
    ALTER TABLE public.inventory_items ADD COLUMN supplier text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'inventory_items' AND column_name = 'cost_per_unit'
  ) THEN
    ALTER TABLE public.inventory_items ADD COLUMN cost_per_unit numeric(10,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'inventory_items' AND column_name = 'location'
  ) THEN
    ALTER TABLE public.inventory_items ADD COLUMN location text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'inventory_items' AND column_name = 'expiry_date'
  ) THEN
    ALTER TABLE public.inventory_items ADD COLUMN expiry_date date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'inventory_items' AND column_name = 'last_ordered_date'
  ) THEN
    ALTER TABLE public.inventory_items ADD COLUMN last_ordered_date timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'inventory_items' AND column_name = 'reorder_quantity'
  ) THEN
    ALTER TABLE public.inventory_items ADD COLUMN reorder_quantity integer DEFAULT 0;
  END IF;
END $$;

-- Add new columns to inventory_transactions if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'inventory_transactions' AND column_name = 'previous_quantity'
  ) THEN
    ALTER TABLE public.inventory_transactions ADD COLUMN previous_quantity integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'inventory_transactions' AND column_name = 'new_quantity'
  ) THEN
    ALTER TABLE public.inventory_transactions ADD COLUMN new_quantity integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'inventory_transactions' AND column_name = 'unit_cost'
  ) THEN
    ALTER TABLE public.inventory_transactions ADD COLUMN unit_cost numeric(10,2) DEFAULT 0;
  END IF;
END $$;

-- Drop existing constraint if it exists and recreate it
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'inventory_transactions_type_check'
    AND table_name = 'inventory_transactions'
  ) THEN
    ALTER TABLE public.inventory_transactions DROP CONSTRAINT inventory_transactions_type_check;
  END IF;

  ALTER TABLE public.inventory_transactions
  ADD CONSTRAINT inventory_transactions_type_check 
  CHECK (type IN ('restock', 'usage', 'waste', 'adjustment'));
END $$;