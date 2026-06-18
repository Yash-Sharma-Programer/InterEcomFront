import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function AdminProducts() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Products Management</h1>
        <button className="btn btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" /> Add Product
        </button>
      </div>

      <div className="card card-body">
        <table className="w-full">
          <thead className="border-b">
            <tr>
              <th className="text-left py-3">Product</th>
              <th className="text-left py-3">Category</th>
              <th className="text-left py-3">Price</th>
              <th className="text-left py-3">Stock</th>
              <th className="text-left py-3">Status</th>
              <th className="text-left py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(10)].map((_, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="py-3 font-bold">Product {i + 1}</td>
                <td className="py-3">Category</td>
                <td className="py-3">$99.99</td>
                <td className="py-3">50</td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                    Active
                  </span>
                </td>
                <td className="py-3 flex gap-2">
                  <button className="btn btn-outline text-sm">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="btn btn-danger text-sm">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
