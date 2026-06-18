import React from 'react';
import { Trash2 } from 'lucide-react';

export default function Cart() {
  const cartItems = [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
          <a href="/products" className="btn btn-primary">Continue Shopping</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card card-body">
              {cartItems.map((item, i) => (
                <div key={i} className="flex items-center gap-4 pb-4 border-b">
                  <div className="w-24 h-24 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-gray-600">${item.price}</p>
                  </div>
                  <button className="btn btn-danger">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="card card-body h-fit">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4 pb-4 border-b">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-xl mb-6">
              <span>Total</span>
              <span>$0.00</span>
            </div>
            <button className="btn btn-primary w-full">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}
