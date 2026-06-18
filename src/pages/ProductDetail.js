import React from 'react';
import { Star, Heart } from 'lucide-react';

export default function ProductDetail() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Image */}
        <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">Product Image</span>
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">Product Name</h1>
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            ))}
            <span className="ml-2 text-gray-600">(128 reviews)</span>
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-6">$99.99</div>
          <p className="text-gray-600 mb-6">Product description goes here</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Quantity</label>
              <input type="number" defaultValue="1" min="1" className="input w-20" />
            </div>
            <div className="flex gap-4">
              <button className="btn btn-primary flex-1">Add to Cart</button>
              <button className="btn btn-outline">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="card card-body">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <p className="text-gray-600">No reviews yet</p>
      </div>
    </div>
  );
}
