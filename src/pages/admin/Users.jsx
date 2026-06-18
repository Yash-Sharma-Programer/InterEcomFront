import React from 'react';
import { Trash2, Lock, Unlock } from 'lucide-react';

export default function AdminUsers() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Users Management</h1>

      <div className="card card-body">
        <table className="w-full">
          <thead className="border-b">
            <tr>
              <th className="text-left py-3">Name</th>
              <th className="text-left py-3">Email</th>
              <th className="text-left py-3">Status</th>
              <th className="text-left py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(10)].map((_, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="py-3">User {i}</td>
                <td className="py-3">user{i}@example.com</td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                    Active
                  </span>
                </td>
                <td className="py-3 flex gap-2">
                  <button className="btn btn-outline text-sm">
                    <Unlock className="w-4 h-4" />
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
