import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { InventoryAnalytics } from '../../lib/types';
import { formatCurrency } from '../../lib/notification';
import { AlertTriangle, TrendingUp, Package, DollarSign } from 'lucide-react';

interface InventoryAnalyticsProps {
  analytics: InventoryAnalytics;
}

export function InventoryAnalyticsView({ analytics }: InventoryAnalyticsProps) {
  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-primary-800/50 backdrop-blur-lg rounded-lg p-4 border border-primary-700/50">
          <div className="flex items-center gap-3">
            <Package className="text-accent-400" />
            <div>
              <h3 className="text-primary-300 text-sm">Total Items</h3>
              <p className="text-2xl font-semibold text-white">{analytics.totalItems}</p>
            </div>
          </div>
        </div>
        <div className="bg-primary-800/50 backdrop-blur-lg rounded-lg p-4 border border-primary-700/50">
          <div className="flex items-center gap-3">
            <DollarSign className="text-accent-400" />
            <div>
              <h3 className="text-primary-300 text-sm">Total Value</h3>
              <p className="text-2xl font-semibold text-white">{formatCurrency(analytics.totalValue)}</p>
            </div>
          </div>
        </div>
        <div className="bg-primary-800/50 backdrop-blur-lg rounded-lg p-4 border border-primary-700/50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-400" />
            <div>
              <h3 className="text-primary-300 text-sm">Low Stock Items</h3>
              <p className="text-2xl font-semibold text-white">{analytics.lowStockItems.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-primary-800/50 backdrop-blur-lg rounded-lg p-4 border border-primary-700/50">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-yellow-400" />
            <div>
              <h3 className="text-primary-300 text-sm">Expiring Soon</h3>
              <p className="text-2xl font-semibold text-white">{analytics.expiringItems?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {(analytics.lowStockItems.length > 0 || (analytics.expiringItems && analytics.expiringItems.length > 0)) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {analytics.lowStockItems.length > 0 && (
            <div className="bg-primary-800/50 backdrop-blur-lg rounded-lg p-6 border border-primary-700/50">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="text-red-400" />
                Low Stock Items
              </h3>
              <div className="space-y-3">
                {analytics.lowStockItems.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg border border-red-700/30"
                  >
                    <div>
                      <h4 className="font-medium text-white">{item.name}</h4>
                      <p className="text-sm text-red-300">
                        Current: {item.quantity} | Min: {item.reorderPoint}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-red-900/50 text-red-400 rounded-full text-sm">
                      Reorder
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {analytics.expiringItems && analytics.expiringItems.length > 0 && (
            <div className="bg-primary-800/50 backdrop-blur-lg rounded-lg p-6 border border-primary-700/50">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="text-yellow-400" />
                Expiring Soon
              </h3>
              <div className="space-y-3">
                {analytics.expiringItems.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 bg-yellow-900/20 rounded-lg border border-yellow-700/30"
                  >
                    <div>
                      <h4 className="font-medium text-white">{item.name}</h4>
                      <p className="text-sm text-yellow-300">
                        Quantity: {item.quantity} | Expires: {new Date(item.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-900/50 text-yellow-400 rounded-full text-sm">
                      Use Soon
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cost Trends */}
      <div className="bg-primary-800/50 backdrop-blur-lg rounded-lg p-6 border border-primary-700/50">
        <h3 className="text-xl font-semibold text-white mb-4">Cost Trends</h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.costTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                  color: '#fff'
                }}
                formatter={(value) => formatCurrency(Number(value))}
              />
              <Line type="monotone" dataKey="totalCost" stroke="#fbbf24" name="Total Cost" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Supplier Performance */}
      {analytics.supplierPerformance.length > 0 && (
        <div className="bg-primary-800/50 backdrop-blur-lg rounded-lg p-6 border border-primary-700/50">
          <h3 className="text-xl font-semibold text-white mb-4">Supplier Performance</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.supplierPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="reliability" fill="#fbbf24" name="Reliability %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {analytics.supplierPerformance.map((supplier) => (
                <div
                  key={supplier.name}
                  className="p-4 bg-primary-700/30 rounded-lg border border-primary-600/30"
                >
                  <h4 className="font-medium text-white">{supplier.name}</h4>
                  <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                    <div>
                      <p className="text-primary-300">Reliability</p>
                      <p className="text-accent-400">{supplier.reliability.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-primary-300">Avg. Delivery</p>
                      <p className="text-accent-400">{supplier.averageDeliveryTime.toFixed(1)} days</p>
                    </div>
                    <div>
                      <p className="text-primary-300">Quality Rating</p>
                      <div className="flex items-center gap-1">
                        <p className="text-accent-400">{supplier.qualityRating.toFixed(1)}</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-sm ${
                                star <= Math.round(supplier.qualityRating)
                                  ? 'text-yellow-400'
                                  : 'text-gray-600'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-primary-300">Total Orders</p>
                      <p className="text-accent-400">{supplier.totalOrders}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}