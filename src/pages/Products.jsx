import React from 'react';
import { Search, Filter } from 'lucide-react';

export default function Products() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2" /> Filters
            </h2>
            
            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-bold mb-3">Categories</h3>
              <div className="space-y-2">
                {['Electronics', 'Fashion', 'Home', 'Sports'].map(cat => (
                  <label key={cat} className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="font-bold mb-3">Price Range</h3>
              <input type="range" className="w-full" min="0" max="1000" />
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>$0</span>
                <span>$1000</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <h3 className="font-bold mb-3">Rating</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(rating => (
                  <label key={rating} className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    {'⭐'.repeat(rating)} & up
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="md:col-span-3">
          {/* Search and Sort */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="input pl-10"
              />
            </div>
            <select className="input">
              <option>Latest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Most Popular</option>
            </select>
          </div>

          {/* Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="card overflow-hidden hover:shadow-xl transition-shadow">
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Product Image</span>
                </div>
                <div className="card-body">
                  <h3 className="font-bold mb-2">Product {i + 1}</h3>
                  <p className="text-gray-600 text-sm mb-4">Quality product description</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">$99.99</span>
                    <button className="btn btn-primary text-sm">Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-8">
            {[1, 2, 3, 4, 5].map(page => (
              <button
                key={page}
                className={`px-4 py-2 rounded ${
                  page === 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
