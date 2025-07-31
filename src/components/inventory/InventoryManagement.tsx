import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, History, AlertTriangle, TrendingUp, RefreshCw, Filter, Search, Edit, Trash2 } from 'lucide-react';
import { 
  fetchInventoryItems, 
  fetchInventoryTransactions, 
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  updateItemQuantity
} from '../../lib/inventory';
import { InventoryItem, InventoryTransaction } from '../../lib/types';
import { formatCurrency } from '../../lib/notification';
import toast from 'react-hot-toast';

interface InventoryManagementProps {
  isViewer: boolean;
}

export function InventoryManagement({ isViewer }: InventoryManagementProps) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'category'>('name');
  const [transactionData, setTransactionData] = useState({
    type: 'restock' as 'restock' | 'usage' | 'waste' | 'adjustment',
    quantity: '',
    notes: ''
  });
  const [itemFormData, setItemFormData] = useState({
    name: '',
    description: '',
    quantity: '0',
    unit: '',
    min_quantity: '0',
    category: '',
    supplier: '',
    cost_per_unit: '0',
    location: '',
    reorder_quantity: '0'
  });

  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = async () => {
    try {
      setLoading(true);
      const [itemsData, transactionsData] = await Promise.all([
        fetchInventoryItems(),
        fetchInventoryTransactions()
      ]);
      setItems(itemsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error loading inventory data:', error);
      toast.error('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer) {
      toast.error('Viewers cannot modify inventory');
      return;
    }

    try {
      const newItem = await createInventoryItem({
        name: itemFormData.name.trim(),
        description: itemFormData.description.trim() || undefined,
        quantity: parseInt(itemFormData.quantity),
        unit: itemFormData.unit.trim(),
        min_quantity: parseInt(itemFormData.min_quantity),
        cost_per_unit: parseFloat(itemFormData.cost_per_unit),
        category: itemFormData.category.trim() || undefined,
        supplier: itemFormData.supplier.trim(),
        location: itemFormData.location.trim() || undefined,
        reorder_quantity: parseInt(itemFormData.reorder_quantity)
      });

      toast.success('Item created successfully');
      setItems(prev => [...prev, newItem]);
      setShowItemForm(false);
      resetItemForm();
    } catch (error) {
      console.error('Error creating item:', error);
      toast.error('Failed to create item');
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer || !editingItem) {
      toast.error('Viewers cannot modify inventory');
      return;
    }

    try {
      const updatedItem = await updateInventoryItem(editingItem.id, {
        name: itemFormData.name.trim(),
        description: itemFormData.description.trim() || undefined,
        unit: itemFormData.unit.trim(),
        min_quantity: parseInt(itemFormData.min_quantity),
        cost_per_unit: parseFloat(itemFormData.cost_per_unit),
        category: itemFormData.category.trim() || undefined,
        supplier: itemFormData.supplier.trim(),
        location: itemFormData.location.trim() || undefined,
        reorder_quantity: parseInt(itemFormData.reorder_quantity)
      });

      toast.success('Item updated successfully');
      setItems(prev => prev.map(item => item.id === editingItem.id ? updatedItem : item));
      setEditingItem(null);
      setShowItemForm(false);
      resetItemForm();
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (isViewer) {
      toast.error('Viewers cannot modify inventory');
      return;
    }

    if (!confirm('Are you sure you want to delete this item? This will also delete all related transactions.')) {
      return;
    }

    try {
      await deleteInventoryItem(itemId);
      toast.success('Item deleted successfully');
      setItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const handleQuantityUpdate = async (item: InventoryItem, newQuantity: number) => {
    if (isViewer) {
      toast.error('Viewers cannot modify inventory');
      return;
    }

    if (newQuantity < 0) {
      toast.error('Quantity cannot be negative');
      return;
    }

    try {
      const transactionType = newQuantity > item.quantity ? 'restock' : 
                             newQuantity < item.quantity ? 'usage' : 'adjustment';
      
      await updateItemQuantity(
        item.id, 
        newQuantity, 
        transactionType,
        `Quick update: ${item.quantity} → ${newQuantity}`
      );

      toast.success('Inventory updated successfully');
      await loadInventoryData();
    } catch (error) {
      console.error('Error updating inventory:', error);
      toast.error('Failed to update inventory');
    }
  };

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer || !selectedItem) {
      toast.error('Viewers cannot modify inventory');
      return;
    }

    const quantity = parseInt(transactionData.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    try {
      let newQuantity = selectedItem.quantity;
      
      switch (transactionData.type) {
        case 'restock':
          newQuantity += quantity;
          break;
        case 'usage':
        case 'waste':
          newQuantity = Math.max(0, newQuantity - quantity);
          break;
        case 'adjustment':
          newQuantity = quantity;
          break;
      }

      await updateItemQuantity(
        selectedItem.id,
        newQuantity,
        transactionData.type,
        transactionData.notes || `${transactionData.type} transaction`
      );

      toast.success('Transaction recorded successfully');
      setShowTransactionForm(false);
      setSelectedItem(null);
      setTransactionData({ type: 'restock', quantity: '', notes: '' });
      await loadInventoryData();
    } catch (error) {
      console.error('Error recording transaction:', error);
      toast.error('Failed to record transaction');
    }
  };

  const resetItemForm = () => {
    setItemFormData({
      name: '',
      description: '',
      quantity: '0',
      unit: '',
      min_quantity: '0',
      category: '',
      supplier: '',
      cost_per_unit: '0',
      location: '',
      reorder_quantity: '0'
    });
  };

  const startEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setItemFormData({
      name: item.name,
      description: item.description || '',
      quantity: item.quantity.toString(),
      unit: item.unit,
      min_quantity: item.min_quantity.toString(),
      category: item.category || '',
      supplier: item.supplier,
      cost_per_unit: item.cost_per_unit.toString(),
      location: item.location || '',
      reorder_quantity: item.reorder_quantity.toString()
    });
    setShowItemForm(true);
  };

  const filteredItems = items
    .filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(item => categoryFilter === 'all' || item.category === categoryFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'quantity':
          return b.quantity - a.quantity;
        case 'category':
          return (a.category || '').localeCompare(b.category || '');
        default:
          return 0;
      }
    });

  const categories = Array.from(new Set(items.map(item => item.category).filter(Boolean)));
  const lowStockItems = items.filter(item => item.quantity <= item.min_quantity);
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.cost_per_unit), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
          <p className="text-primary-300">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-primary-800/50 backdrop-blur-lg rounded-lg p-4 border border-primary-700/50">
          <div className="flex items-center gap-3">
            <Package className="text-accent-400" />
            <div>
              <h3 className="text-primary-300 text-sm">Total Items</h3>
              <p className="text-2xl font-semibold text-white">{items.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-primary-800/50 backdrop-blur-lg rounded-lg p-4 border border-primary-700/50">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-green-400" />
            <div>
              <h3 className="text-primary-300 text-sm">Total Value</h3>
              <p className="text-2xl font-semibold text-white">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </div>
        <div className="bg-primary-800/50 backdrop-blur-lg rounded-lg p-4 border border-primary-700/50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-400" />
            <div>
              <h3 className="text-primary-300 text-sm">Low Stock</h3>
              <p className="text-2xl font-semibold text-white">{lowStockItems.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-primary-800/50 backdrop-blur-lg rounded-lg p-4 border border-primary-700/50">
          <div className="flex items-center gap-3">
            <History className="text-blue-400" />
            <div>
              <h3 className="text-primary-300 text-sm">Transactions</h3>
              <p className="text-2xl font-semibold text-white">{transactions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-primary-700/50 border border-primary-600 rounded-lg text-white placeholder-primary-400"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-primary-700/50 border border-primary-600 rounded-lg px-4 py-2 text-white"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'quantity' | 'category')}
          className="bg-primary-700/50 border border-primary-600 rounded-lg px-4 py-2 text-white"
        >
          <option value="name">Sort by Name</option>
          <option value="quantity">Sort by Quantity</option>
          <option value="category">Sort by Category</option>
        </select>
        {!isViewer && (
          <button
            onClick={() => setShowItemForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-500 transition-colors"
          >
            <Plus size={20} />
            Add Item
          </button>
        )}
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="text-red-400" />
            <h3 className="text-red-400 font-semibold">Low Stock Alert</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {lowStockItems.map(item => (
              <div key={item.id} className="text-sm text-red-300">
                {item.name}: {item.quantity} {item.unit} (min: {item.min_quantity})
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary-700/50 rounded-lg p-4 border border-primary-600/50"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-white">{item.name}</h3>
                {item.category && (
                  <p className="text-sm text-primary-300">{item.category}</p>
                )}
              </div>
              {!isViewer && (
                <div className="flex gap-1">
                  <button
                    onClick={() => startEditItem(item)}
                    className="p-1 text-primary-300 hover:text-white transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-primary-300">Current Stock</span>
                <span className={`font-medium ${
                  item.quantity <= item.min_quantity 
                    ? 'text-red-400' 
                    : 'text-accent-400'
                }`}>
                  {item.quantity} {item.unit}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-primary-300">Minimum Stock</span>
                <span className="text-primary-400">{item.min_quantity} {item.unit}</span>
              </div>
              {item.supplier && (
                <div className="flex justify-between text-sm">
                  <span className="text-primary-300">Supplier</span>
                  <span className="text-primary-400">{item.supplier}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-primary-300">Value</span>
                <span className="text-accent-400">
                  {formatCurrency(item.quantity * item.cost_per_unit)}
                </span>
              </div>
            </div>

            {!isViewer && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleQuantityUpdate(item, Math.max(0, item.quantity - 1))}
                  className="flex-1 px-3 py-1.5 bg-primary-600/50 text-primary-300 rounded hover:bg-primary-600 transition-colors"
                >
                  -1
                </button>
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setShowTransactionForm(true);
                  }}
                  className="flex-1 px-3 py-1.5 bg-accent-600/20 text-accent-400 rounded hover:bg-accent-600/30 transition-colors"
                >
                  Update
                </button>
                <button
                  onClick={() => handleQuantityUpdate(item, item.quantity + 1)}
                  className="flex-1 px-3 py-1.5 bg-primary-600/50 text-primary-300 rounded hover:bg-primary-600 transition-colors"
                >
                  +1
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Item Form Modal */}
      {showItemForm && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-primary-800/90 backdrop-blur-lg rounded-lg shadow-premium border border-primary-700/50 p-4 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">

      {/* Header with Title and Buttons */}
      <div className="flex justify-between items-center px-6 pt-6 pb-2">
        <h3 className="text-xl font-semibold text-white">
          {editingItem ? 'Edit Item' : 'Add New Item'}
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setShowItemForm(false);
              setEditingItem(null);
              resetItemForm();
            }}
            className="px-4 py-1.5 text-sm bg-primary-700/80 text-primary-300 rounded-lg hover:bg-primary-600 transition-colors border border-primary-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="inventory-form"
            className="px-4 py-1.5 text-sm bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg hover:from-accent-600 hover:to-accent-700 transition-all duration-200 font-medium shadow-lg hover:shadow-glow"
          >
            {editingItem ? 'Update' : 'Add'}
          </button>
        </div>
      </div>

      {/* Scrollable Form Content */}
      <div className="overflow-y-auto px-6 pb-6 pr-3 flex-1">
        <form
          onSubmit={editingItem ? handleUpdateItem : handleCreateItem}
          id="inventory-form"
          className="space-y-4"
        >
          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-300 mb-1">Item Name *</label>
              <input
                type="text"
                value={itemFormData.name}
                onChange={(e) => setItemFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 bg-primary-700/50 border border-primary-600 rounded-lg text-white placeholder-primary-400"
                placeholder="Enter item name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-300 mb-1">Category</label>
              <input
                type="text"
                value={itemFormData.category}
                onChange={(e) => setItemFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-2 bg-primary-700/50 border border-primary-600 rounded-lg text-white placeholder-primary-400"
                placeholder="Enter category"
              />
            </div>
            {!editingItem && (
              <div>
                <label className="block text-sm font-medium text-primary-300 mb-1">Initial Quantity *</label>
                <input
                  type="number"
                  value={itemFormData.quantity}
                  onChange={(e) => setItemFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  className="w-full p-2 bg-primary-700/50 border border-primary-600 rounded-lg text-white placeholder-primary-400"
                  required
                  min="0"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-primary-300 mb-1">Unit *</label>
              <input
                type="text"
                value={itemFormData.unit}
                onChange={(e) => setItemFormData(prev => ({ ...prev, unit: e.target.value }))}
                className="w-full p-2 bg-primary-700/50 border border-primary-600 rounded-lg text-white placeholder-primary-400"
                placeholder="kg, pieces, liters, etc."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-300 mb-1">Minimum Quantity *</label>
              <input
                type="number"
                value={itemFormData.min_quantity}
                onChange={(e) => setItemFormData(prev => ({ ...prev, min_quantity: e.target.value }))}
                className="w-full p-2 bg-primary-700/50 border border-primary-600 rounded-lg text-white placeholder-primary-400"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-300 mb-1">Reorder Quantity</label>
              <input
                type="number"
                value={itemFormData.reorder_quantity}
                onChange={(e) => setItemFormData(prev => ({ ...prev, reorder_quantity: e.target.value }))}
                className="w-full p-2 bg-primary-700/50 border border-primary-600 rounded-lg text-white placeholder-primary-400"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-300 mb-1">Cost per Unit *</label>
              <input
                type="number"
                step="0.01"
                value={itemFormData.cost_per_unit}
                onChange={(e) => setItemFormData(prev => ({ ...prev, cost_per_unit: e.target.value }))}
                className="w-full p-2 bg-primary-700/50 border border-primary-600 rounded-lg text-white placeholder-primary-400"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-300 mb-1">Supplier</label>
              <input
                type="text"
                value={itemFormData.supplier}
                onChange={(e) => setItemFormData(prev => ({ ...prev, supplier: e.target.value }))}
                className="w-full p-2 bg-primary-700/50 border border-primary-600 rounded-lg text-white placeholder-primary-400"
                placeholder="Supplier name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-300 mb-1">Location</label>
              <input
                type="text"
                value={itemFormData.location}
                onChange={(e) => setItemFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full p-2 bg-primary-700/50 border border-primary-600 rounded-lg text-white placeholder-primary-400"
                placeholder="Storage location"
              />
            </div>
          </div>

          {/* Description Field */}
<div>
  <label className="block text-sm font-medium text-primary-300 mb-1">Description</label>
  <textarea
    value={itemFormData.description}
    onChange={(e) =>
      setItemFormData((prev) => ({ ...prev, description: e.target.value }))
    }
    className="w-full p-2 bg-primary-700/50 border border-primary-600 rounded-lg text-white placeholder-primary-400"
    rows={3}
    placeholder="Item description (optional)"
  />
</div>

{/* Spacer div to prevent bottom clipping */}
<div className="h-8" /> {/* Adjust height if needed */}

</form>
</div>
</div>
</div>
)}




      {/* Transaction Form Modal */}
      {showTransactionForm && selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-primary-800/50 backdrop-blur-lg rounded-lg shadow-premium border border-primary-700/50 p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Update Stock: {selectedItem.name}
            </h3>
            <div className="mb-4 p-3 bg-primary-700/30 rounded-lg">
              <p className="text-sm text-primary-300">Current Stock: {selectedItem.quantity} {selectedItem.unit}</p>
            </div>
            <form onSubmit={handleTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-300 mb-1">
                  Transaction Type
                </label>
                <select
                  value={transactionData.type}
                  onChange={(e) => setTransactionData(prev => ({ 
                    ...prev, 
                    type: e.target.value as 'restock' | 'usage' | 'waste' | 'adjustment'
                  }))}
                  className="w-full p-2 bg-primary-700/50 border border-primary-600 rounded-lg text-white"
                >
                  <option value="restock">Restock (Add)</option>
                  <option value="usage">Usage (Remove)</option>
                  <option value="waste">Waste (Remove)</option>
                  <option value="adjustment">Adjustment (Set to)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-300 mb-1">
                  Quantity ({selectedItem.unit})
                </label>
                <input
                  type="number"
                  value={transactionData.quantity}
                  onChange={(e) => setTransactionData(prev => ({ 
                    ...prev, 
                    quantity: e.target.value
                  }))}
                  className="w-full p-2 bg-primary-700/50 border border-primary-600 rounded-lg text-white"
                  min="0"
                  step="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={transactionData.notes}
                  onChange={(e) => setTransactionData(prev => ({ 
                    ...prev, 
                    notes: e.target.value
                  }))}
                  className="w-full p-2 bg-primary-700/50 border border-primary-600 rounded-lg text-white"
                  rows={3}
                  placeholder="Optional notes about this transaction"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowTransactionForm(false);
                    setSelectedItem(null);
                    setTransactionData({ type: 'restock', quantity: '', notes: '' });
                  }}
                  className="px-4 py-2 bg-primary-700 text-primary-300 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-500 transition-colors"
                >
                  Record Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}