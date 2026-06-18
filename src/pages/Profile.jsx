import React from 'react';
import { User, MapPin, ShoppingBag } from 'lucide-react';

export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="card card-body text-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold">John Doe</h2>
            <p className="text-gray-600">john@example.com</p>
            <button className="btn btn-primary w-full mt-4">Edit Profile</button>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Orders */}
          <div className="card card-body">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2" /> Recent Orders
            </h2>
            <p className="text-gray-600">No orders yet</p>
          </div>

          {/* Addresses */}
          <div className="card card-body">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" /> Saved Addresses
            </h2>
            <p className="text-gray-600">No addresses saved</p>
            <button className="btn btn-primary mt-4">Add Address</button>
          </div>
        </div>
      </div>
    </div>
  );
}
