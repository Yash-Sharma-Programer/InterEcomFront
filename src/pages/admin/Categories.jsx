import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function AdminCategories() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Categories Management</h1>
        <button className="btn btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="w-full h-32 bg-gray-200"></div>
            <div className="card-body">
              <h3 className="font-bold mb-4">Category {i + 1}</h3>
              <div className="flex gap-2">
                <button className="btn btn-outline flex-1">Edit</button>
                <button className="btn btn-danger">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
