import React from 'react';

export default function AdminOrders() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Orders Management</h1>

      <div className="card card-body">
        <table className="w-full">
          <thead className="border-b">
            <tr>
              <th className="text-left py-3">Order ID</th>
              <th className="text-left py-3">Customer</th>
              <th className="text-left py-3">Amount</th>
              <th className="text-left py-3">Status</th>
              <th className="text-left py-3">Date</th>
              <th className="text-left py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(10)].map((_, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="py-3">#ORD{1000 + i}</td>
                <td className="py-3">Customer {i}</td>
                <td className="py-3">$99.99</td>
                <td className="py-3">
                  <select className="input text-sm p-1">
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                  </select>
                </td>
                <td className="py-3">2026-01-01</td>
                <td className="py-3">
                  <button className="btn btn-primary text-sm">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
