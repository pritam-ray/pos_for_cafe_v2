import { supabase } from './supabase';
import { InventoryItem, InventoryTransaction } from './types';

export async function fetchInventoryItems(): Promise<InventoryItem[]> {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .order('name');
    
  if (error) throw error;
  return data || [];
}

export async function fetchInventoryTransactions(itemId?: string): Promise<InventoryTransaction[]> {
  let query = supabase
    .from('inventory_transactions')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (itemId) {
    query = query.eq('item_id', itemId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createInventoryItem(item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>): Promise<InventoryItem> {
  const { data, error } = await supabase
    .from('inventory_items')
    .insert([item])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem> {
  const { data, error } = await supabase
    .from('inventory_items')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function deleteInventoryItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('inventory_items')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
}

export async function createInventoryTransaction(transaction: Omit<InventoryTransaction, 'id' | 'created_at'>): Promise<InventoryTransaction> {
  const { data, error } = await supabase
    .from('inventory_transactions')
    .insert([transaction])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateItemQuantity(itemId: string, newQuantity: number, transactionType: 'restock' | 'usage' | 'waste' | 'adjustment', notes?: string): Promise<void> {
  // First get the current item data
  const { data: currentItem, error: fetchError } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('id', itemId)
    .single();

  if (fetchError) throw fetchError;

  const quantityChange = newQuantity - currentItem.quantity;

  // Get the current authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  // Update the item quantity
  const { error: updateError } = await supabase
    .from('inventory_items')
    .update({ 
      quantity: newQuantity,
      updated_at: new Date().toISOString()
    })
    .eq('id', itemId);

  if (updateError) throw updateError;

  // Create transaction record
  const { error: transactionError } = await supabase
    .from('inventory_transactions')
    .insert([{
      item_id: itemId,
      quantity_change: Math.abs(quantityChange),
      type: transactionType,
      notes: notes || `${transactionType} - quantity changed from ${currentItem.quantity} to ${newQuantity}`,
      previous_quantity: currentItem.quantity,
      new_quantity: newQuantity,
      unit_cost: currentItem.cost_per_unit || 0,
      created_by: user?.id || null
    }]);

  if (transactionError) throw transactionError;
}