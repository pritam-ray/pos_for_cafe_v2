import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { ItemAnalytics } from '../../lib/types';
import { formatCurrency } from '../../lib/notification';
import { ArrowLeft } from 'lucide-react';

interface ItemAnalyticsProps {
  analytics: ItemAnalytics;
  onBack: () => void;
}

const COLORS = ['#fbbf24', '#34d399', '#60a5fa', '#f87171', '#818cf8'];

export function ItemAnalyticsView({ analytics, onBack }: ItemAnalyticsProps) {
  if (!analytics) {
    return (
      <div className="p-4 text-center text-primary-300">
        No analytics data available for this item.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-primary-700/50 text-primary-300 rounded-lg hover:bg-primary-700 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Overview
        </button>
        <h2 className="text-xl font-semibold text-white">{analytics.name}</h2>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-primary-800/50 backdrop-blur-lg rounded-lg p-4 border border-primary-700/50">
          <h3 className="text-primary-300 text-sm">Total Orders</h3>
          <p className="text-2xl font-semibold text-white mt-1">{analytics.totalOrders}</p>
        </div>
        <div className="bg-primary-800/50 backdrop-blur-lg rounded-lg p-4 border border-primary-700/50">
          <h3 className="text-primary-300 text-sm">Total Quantity Sold</h3>
          <p className="text-2xl font-semibold text-white mt-1">{analytics.totalQuantity}</p>
        </div>
        <div className="bg-primary-800/50 backdrop-blur-lg rounded-lg p-4 border border-primary-700/50">
          <h3 className="text-primary-300 text-sm">Total Revenue</h3>
          <p className="text-2xl font-semibold text-white mt-1">{formatCurrency(analytics.totalRevenue)}</p>
        </div>
        <div className="bg-primary-800/50 backdrop-blur-lg rounded-lg p-4 border border-primary-700/50">
          <h3 className="text-primary-300 text-sm">Avg. Preparation Time</h3>
          <p className="text-2xl font-semibold text-white mt-1">{analytics.preparationTime} min</p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary-800/50 backdrop-blur-lg rounded-lg p-4 border border-primary-700/50">
          <h3 className="text-primary-300 text-sm">Profit Margin</h3>
          <p className="text-2xl font-semibold text-accent-400 mt-1">{analytics.profitMargin.toFixed(1)}%</p>
          <div className="w-full bg-primary-700 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-accent-500 to-accent-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, analytics.profitMargin)}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-primary-800/50 backdrop-blur-lg rounded-lg p-4 border border-primary-700/50">
          <h3 className="text-primary-300 text-sm">Wastage Rate</h3>
          <p className="text-2xl font-semibold text-red-400 mt-1">{analytics.wastageRate.toFixed(1)}%</p>
          <div className="w-full bg-primary-700 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-red-500 to-red-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, analytics.wastageRate * 5)}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-primary-800/50 backdrop-blur-lg rounded-lg p-4 border border-primary-700/50">
          <h3 className="text-primary-300 text-sm">Avg Order Value</h3>
          <p className="text-2xl font-semibold text-white mt-1">{formatCurrency(analytics.averageOrderValue)}</p>
        </div>
      </div>
      {/* Sales Trend */}
      <div className="bg-primary-800/50 backdrop-blur-lg rounded-lg p-6 border border-primary-700/50">
        <h3 className="text-xl font-semibold text-white mb-4">Sales Trend</h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.salesTrend}>
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
              />
              <Line type="monotone" dataKey="revenue" stroke="#fbbf24" name="Revenue" />
              <Line type="monotone" dataKey="quantity" stroke="#60a5fa" name="Quantity" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Popular Combinations & Time Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-primary-800/50 backdrop-blur-lg rounded-lg p-6 border border-primary-700/50">
          <h3 className="text-xl font-semibold text-white mb-4">Popular Combinations</h3>
          {analytics.popularCombinations.length > 0 ? (
            <div className="space-y-3">
              {analytics.popularCombinations.map((combo, index) => (
                <div key={combo.itemName} className="flex items-center justify-between p-3 bg-primary-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-accent-500/20 text-accent-400 rounded-full flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <span className="text-primary-200">{combo.itemName}</span>
                  </div>
                  <span className="text-accent-400 font-medium">{combo.occurrences} times</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-primary-400">
              <p>No combination data available yet</p>
              <p className="text-sm mt-1">Data will appear as more orders are placed</p>
            </div>
          )}
        </div>

        <div className="bg-primary-800/50 backdrop-blur-lg rounded-lg p-6 border border-primary-700/50">
          <h3 className="text-xl font-semibold text-white mb-4">Orders by Time of Day</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Morning', value: analytics.ordersByTimeOfDay.morning },
                    { name: 'Afternoon', value: analytics.ordersByTimeOfDay.afternoon },
                    { name: 'Evening', value: analytics.ordersByTimeOfDay.evening },
                    { name: 'Night', value: analytics.ordersByTimeOfDay.night }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Customer Feedback */}
      <div className="bg-primary-800/50 backdrop-blur-lg rounded-lg p-6 border border-primary-700/50">
        <h3 className="text-xl font-semibold text-white mb-4">Customer Feedback</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-center mb-4">
              <p className="text-4xl font-bold text-accent-400">{analytics.customerFeedback.averageRating.toFixed(1)}</p>
              <p className="text-primary-300">Average Rating</p>
              <p className="text-sm text-primary-400 mt-1">Based on {analytics.customerFeedback.totalRatings} ratings</p>
              <div className="flex justify-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-2xl ${
                      star <= Math.round(analytics.customerFeedback.averageRating)
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
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(analytics.customerFeedback.ratingDistribution).map(([rating, count]) => ({
                    rating: Number(rating),
                    count
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="rating" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="count" fill="#fbbf24" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}