import React from 'react';
import { BarChart3, ShoppingCart, Users, Package, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Total Users', value: '1,234', icon: Users, color: 'text-blue-600' },
    { label: 'Total Products', value: '567', icon: Package, color: 'text-green-600' },
    { label: 'Total Orders', value: '892', icon: ShoppingCart, color: 'text-purple-600' },
    { label: 'Total Revenue', value: '$45,230', icon: TrendingUp, color: 'text-red-600' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="card card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <Icon className={`w-12 h-12 ${stat.color} opacity-20`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card card-body">
          <h2 className="text-lg font-bold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2">Order ID</th>
                  <th className="text-left py-2">Customer</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-2">#ORD{1000 + i}</td>
                    <td className="py-2">Customer {i}</td>
                    <td className="py-2">$99.99</td>
                    <td className="py-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                        Pending
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users */}
        <div className="card card-body">
          <h2 className="text-lg font-bold mb-4">Recent Users</h2>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between pb-3 border-b">
                <div>
                  <p className="font-bold">User {i}</p>
                  <p className="text-sm text-gray-600">user{i}@example.com</p>
                </div>
                <span className="text-sm text-gray-600">Today</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
